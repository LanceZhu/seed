import json
import numpy as np
import pymysql as pms
import random


class personal_recommend:

    def __init__(self, K=20):
        self.conn = pms.connect('127.0.0.1', 'root', 'Gzj19980309', 'cauth')
        self.cur = self.conn.cursor(pms.cursors.DictCursor)

        self.userNo = self.cur.execute("select * from csessioninfo")
        self.users = self.cur.fetchall()

        self.questionNo = self.cur.execute("select * from question_detail")
        self.questions = self.cur.fetchall()

        self.cur.execute("select * from answer_detail")
        alldata = self.cur.fetchall()
        ratings = {}
        for data in alldata:
            self.cur.execute("select csessioninfo.uid, question_detail.difficulty from csessioninfo, question_detail where csessioninfo.open_id='%s' and question_detail.id=%d" % (data['openId'], data['question_id']))
            data_data = self.cur.fetchall()
            rating = (20 - data['answer_time']) * data['answer_right'] * data_data['difficulty'] + (20 - data['answer_time']) / 20 / data['difficulty']
            ratings.setdefault((int(data_data['uid']), int(data['question_id'])), [])
            ratings[(int(data_data['uid']), int(data['question_id']))].append(rating)

        self.alldata = [] #[[uid, iid, rating],]
        for data in ratings:
            self.alldata.append([data[0], data[1], np.mean(ratings[data])])

        self.test = []
        self.mat = []
        for data in self.alldata:
            rand = random.random()
            if rand >= 0.9:
                self.test.append(data)
            else:
                self.mat.append(data)
        self.test = np.array(self.test)
        self.mat = np.array(self.mat)

        self.K = K
        self.bi = {}
        self.bu = {}
        self.qi = {}
        self.pu = {}
        self.avg = np.mean(self.mat[:, 2])
        self.y = {}
        self.u_dict = {}
        self.topN = {}

        for i in range(self.mat.shape[0]):
            uid = self.mat[i, 0]
            iid = self.mat[i, 1]
            self.u_dict.setdefault(uid, [])
            self.u_dict[uid].append(iid)
            self.bi.setdefault(iid, 0)
            self.bu.setdefault(uid, 0)
            self.qi.setdefault(iid, np.random.random((self.K, 1)) / 10 * np.sqrt(self.K))
            self.pu.setdefault(uid, np.random.random((self.K, 1)) / 10 * np.sqrt(self.K))
            self.y.setdefault(iid, np.zeros((self.K, 1)) + .1)

    def predict(self, uid, iid):
        self.bi.setdefault(iid, 0)
        self.bu.setdefault(uid, 0)
        self.qi.setdefault(iid, np.zeros((self.K, 1)))
        self.pu.setdefault(uid, np.zeros((self.K, 1)))
        self.y.setdefault(uid, np.zeros((self.K, 1)))
        self.u_dict.setdefault(uid, [])
        u_impl_prf, sqrt_Nu = self.getY(uid, iid)

        rating = self.avg + self.bi[iid] + self.bu[uid] + np.sum(self.qi[iid] * (self.pu[uid] + u_impl_prf))

        return rating

    def getY(self, uid, iid):
        Nu = self.u_dict[uid]
        I_Nu = len(Nu)
        sqrt_Nu = np.sqrt(I_Nu)
        y_u = np.zeros((self.K, 1))
        if I_Nu == 0:
            u_impl_prf = y_u
        else:
            for i in Nu:
                y_u += self.y[i]
            u_impl_prf = y_u / sqrt_Nu

        return u_impl_prf, sqrt_Nu

    def train(self, steps=30, gamma=0.04, Lambda=0.15):
        print('train data size', self.mat.shape)
        for step in range(steps):
            print('step', step + 1, 'is running')
            KK = np.random.permutation(self.mat.shape[0])
            #rmse = 0.0
            for i in range(self.mat.shape[0]):
                j = KK[i]
                uid = self.mat[j, 0]
                iid = self.mat[j, 1]
                rating = self.mat[j, 2]
                predict = self.predict(uid, iid)
                u_impl_prf, sqrt_Nu = self.getY(uid, iid)
                eui = rating - predict
               # rmse += eui ** 2
                self.bu[uid] += gamma * (eui - Lambda * self.bu[uid])
                self.bi[iid] += gamma * (eui - Lambda * self.bi[iid])
                self.pu[uid] += gamma * (eui * self.qi[iid] - Lambda * self.pu[uid])
                self.qi[iid] += gamma * (eui * (self.pu[uid] + u_impl_prf) - Lambda * self.qi[iid])
                for j in self.u_dict[uid]:
                    self.y[j] += gamma * (eui * self.qi[j] / sqrt_Nu - Lambda * self.y[j])

            gamma = 0.93 * gamma
            #print('rmse is', np.sqrt(rmse / self.mat.shape[0]))

    def premat(self):
        self.pre_mat = np.zeros((self.userNo, self.questionNo))
        for uid in range(self.userNo):
            for iid in range(self.questionNo):
                self.pre_mat[uid][iid] = self.predict(uid + 1, iid + 1)

    def recommend(self, uid, N=20):
        train =[]
        for data in self.mat:
            if data[0] == uid:
                train.append(data[1])

        test = []
        for data in self.test:
            if data[0] == uid:
                test.append(data[1])

        ratings = {}
        for iid in self.questionNo:
            ratings.setdefault(iid + 1, self.pre_mat[uid - 1][iid])

        rank = sorted(ratings.items(), key=lambda item: item[1], reverse=True)
        topn = []
        flag = 0
        for data in rank:
            if data not in train:
                topn.append(data)
                flag += 1
            if flag == N:
                break

        intersection = [data for data in topn if data in test]
        recallrate = len(intersection) / len(test)
        accrate = len(intersection) / len(topn)
        self.topN.setdefault(uid, topn)

        return recallrate, accrate, topn

    def updata(self, uid):
        list = []
        for data in self.topN[uid]:
            question = {}
            question.setdefault("id", data)
            list.append(question)

        list_json = json.dumps(list)
        if self.cur.execute("select * from recommend_detail where userId=%d" % uid) == 0:
            sql = "insert into recommend_detail(userId, per_rec_list) values(%s, '{json}')" % uid
        else:
            sql = "update recommend_detail set per_rec_list = '{json}' where openId = %s" % uid
        sql = sql.format(json=pms.escape_string(list_json))
        self.cur.execute(sql)

    def finish(self):
        self.conn.commit()
        self.conn.close()


if __name__ == '__main__':
    r = personal_recommend()
    r.train()
    r.premat()
    r.recommend(1)
    r.updata(1)
    r.finish()
