<?php
/*define("DB_HOST","10.126.103.177");
define("DB_USER","myDatas_f");*/
define("DB_HOST","127.0.0.1");
define("DB_USER","root");
define("DB_PW","2872869");
//define("DB_NAME","myDatas");
define("DB_NAME","wish");
define("DB_TABLE","wish");
define("DB_CHARSET","utf8");

function connect(){
    $conn = mysql_connect(DB_HOST,DB_USER,DB_PW) or die("数据库连接失败Error:".mysql_errno().":".mysql_error());
    mysql_set_charset(DB_CHARSET);//使用格式
    mysql_select_db(DB_NAME,$conn) or die("指定数据库打开失败！");
    return $conn;
}


/**
 * [update description]
 * @param  $table [表]
 * @param  $array [更新的数组]
 * @param  $where [条件]
 * @return        [返回影响的条数]
 */
function update($table,$val,$where=null){
	$sql = "update {$table} set uid=".$val.(($where != null)?" where {$where}":null);
	//echo $sql;
	mysql_query($sql);
	return mysql_affected_rows();//取得前一次 MySQL 操作所影响的记录行数
}

function fechOne($sql,$result_type=MYSQL_ASSOC){
	$result = mysql_query($sql);
	$row = mysql_fetch_array($result,$result_type);
	return $row;
}
?>