<?php
require_once "config.php";
connect();
$Code = 1;

$sql="select uid from ".DB_TABLE;
$row = fechOne($sql);
$table = DB_TABLE;
$newUid = $row['uid']+1;

$up = update($table,$newUid);

if($up){
	$Code = 0;
}

$timeLsit = array(
		"Code" => $Code
	);

echo json_encode($timeLsit);
?>