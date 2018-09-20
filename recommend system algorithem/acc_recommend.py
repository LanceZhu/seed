import pymysql as pms
import pprint
import json


class lowest_acc_rec:

    def linkdb(self, host='127.0.0.1', port=3306, user='root', password='Gzj19980309', db='seed'):
        self.conn = pms.connect(host=host, port=port, user=user, password=password, db=db)
        self.cur = self.conn.cursor(pms.cursors.DictCursor)
        self.userNo = self.cur.execute('select * from user_detail')
        self.user_detail = self.cur.fetchall()
        self.questionNo = self.cur.execute('select * from question_detail')
        self.question_detail = self.cur.fetchall()
        self.behaviorNo = self.cur.execute('select * from user_behavior')
        self.user_behavior = self.cur.fetchall()

    def finish(self):
        self.conn.commit()
        self.cur.close()
        self.conn.close()

    def recommend(self, userId):
        recordsNo = self.cur.execute("select question_detail.id, question_detail.unit_id, user_behavior.accuracy from user_behavior, question_detail where user_behavior.id = question_detail.id and user_behavior.openId = " + userId)
        records = self.cur.fetchall()
        units = []
        id = []
        for record in records:
            id.append(record['id'])
            if record['unit_id'] not in units:
                units.append(record['unit_id'])

        accuracy = []
        for unit in units:
            alldone = rightdone = 0
            for record in records:
                if record['unit_id'] == unit:
                    rightdone += record['accuracy']
                    alldone += 1
            accuracy.append((unit, rightdone / alldone))

        accuracy.sort(key=lambda ac: ac[1])
        lowest_ac_unit = accuracy[0][0]

        self.cur.execute("select * from question_detail where unit_id = %d" % (lowest_ac_unit))
        questions = self.cur.fetchall()
        flag = 0
        lvl_rec_lst = []
        for question in questions:
            dict = {}
            if question['id'] not in id:
                dict.setdefault("id", question['id'])
                lvl_rec_lst.append(dict)

        list_json = json.dumps(lvl_rec_lst)
        if self.cur.execute("select * from recommend where openId = " + userId) == 0:
            sql = "insert into recommend(openId, level_recommend) values(%s, '{json}')" % userId
        else:
            sql = "update recommend set level_recommend = '{json}' where openId = " + userId
        sql = sql.format(json=pms.escape_string(list_json))
        self.cur.execute(sql)


if __name__ == '__main__':
    r = lowest_acc_rec()
    r.linkdb()
    r.recommend('2')
    r.finish()
