import pymysql as pms
import json


class level_difficulty_rec:

    def linkdb(self, host='127.0.0.1', port=3306, user='root', password='Gzj19980309', db='seed'):
        self.conn = pms.connect(host=host, port=port, user=user, password=password, db=db)
        self.cur = self.conn.cursor(pms.cursors.DictCursor)
        self.userNo = self.cur.execute('select * from user_detail')
        self.user_detail = self.cur.fetchall()
        self.questionNo = self.cur.execute('select * from question_detail')
        self.question_detail = self.cur.fetchall()
        self.behaviorNo = self.cur.execute('select * from user_behavior')
        self.user_behavior = self.cur.fetchall()

    def recommend(self, userId):
        cur_done_questions = self.cur.execute('select * from user_behavior where openId = ' + userId)
        cur_behavior = self.cur.fetchall()
        sum_time = 0
        once_time = 0
        id = []
        for behavior in cur_behavior:
            if behavior['openId'] == userId:
                id.append(behavior['id'])
                questionlevel = 0
                for question in self.question_detail:
                    if question['id'] == behavior['id']:
                        questionlevel = int(question['difficulty'])
                sum_time += (25 - int(behavior['staytime']))
                once_time += (25 - int(behavior['staytime'])) * int(behavior['accuracy']) * questionlevel

        userlvl = once_time / sum_time + sum_time / (cur_done_questions * 25)
        userlvl = round(userlvl)
        print(userlvl)
        self.cur.execute("update user_detail set level = %d where openId = %s" % (userlvl, userId))

        self.cur.execute("select * from question_detail where difficulty = '%d'" % userlvl)
        rec_questions = self.cur.fetchall()
        acc_rec_list = []
        for question in rec_questions:
            dict = {}
            if question['id'] not in id:
                dict.setdefault("id", question['id'])
                acc_rec_list.append(dict)

        list_json = json.dumps(acc_rec_list)
        if self.cur.execute("select * from recommend where openId = " + userId) == 0:
            sql = "insert into recommend(openId, acc_recommend) values(%s, '{json}')" % userId
        else:
            sql = "update recommend set acc_recommend = '{json}' where openId = " + userId
        sql = sql.format(json=pms.escape_string(list_json))
        self.cur.execute(sql)


    def finish(self):
        self.conn.commit()
        self.cur.close()
        self.conn.close()


if __name__ == '__main__':
    r = level_difficulty_rec()
    r.linkdb()
    r.recommend('2')
    r.finish()