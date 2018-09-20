import time
import os
import pymysql as pms

host = '127.0.0.1'
port = '3306'
user = 'root'
password = ''
dbname = 'seed'
backuptime = time.strftime('%Y%m%d-%H%M%S')
# front = eval(backuptime[0:8])
# rear = eval(backuptime[9:15])
backup_path = "E:/mysql_backup"

today_backup_path = backup_path + '/' + backuptime
try:
    os.stat(today_backup_path)
except:
    os.mkdir(today_backup_path)

mysqldump = "mysqldump -h" + host + " -P" + port + " -u" + user + " -p" + password + " --databases " + dbname + " > " + today_backup_path + '/' + dbname + '.sql'
os.system(mysqldump)

conn = pms.connect(host=host, user=user, password=password, db='backuptime')
cur = conn.cursor(pms.cursors.DictCursor)
cur.execute("insert into backup(front, rear) value(%d, %d)" % (eval(backuptime[0:8]), eval(backuptime[9:15])))
conn.commit()
conn.close()

print("backup script completed")
print("your backups have been created in '" + today_backup_path + "' directory")
