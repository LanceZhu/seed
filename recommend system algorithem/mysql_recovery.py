import os
import pymysql as pms

host = '127.0.0.1'
port = '3306'
user = 'root'
password = ''
dbname = 'backuptime'

conn = pms.connect(host, user, password, dbname)
cur = conn.cursor(pms.cursors.DictCursor)

cur.execute("select * from backup order by id desc")
record = cur.fetchone()
conn.commit()
conn.close()

front = str(record['front'])
rear = str(record['rear'])
# front = "20180917"
# rear = "162113"
recovery_path = "E:/mysql_backup/" + front + '-' + rear

mysqlrecovery = "mysql -u" + user + " -p" + password + " --default-character-set=utf8 seed < " + recovery_path + "/seed.sql"
os.system(mysqlrecovery)