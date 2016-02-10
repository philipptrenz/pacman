<?php
	/*
	 * This site gets the POST data from index.php and enteres it into the database.
	 */

	// redirect to index.php
	header('Location: index.php#highscore'); 

    require_once ('config.php');

    @$db = mysqli_connect(
            MYSQL_HOST, 
            MYSQL_USER, 
            MYSQL_PASSWORD, 
            MYSQL_DATABASE
        );

    if ($_POST) {

	    // get max id from database
	    $res = mysqli_query($db, "SELECT MAX(id) AS 'maxid' FROM main");
	    $row = mysqli_fetch_assoc($res); 

	    $id = 0;
	    if ($row) $id = $row['maxid']+1;

	    $name = $_POST['name'];
	    $score = $_POST['score'];

	    // coorrect names
	    if (strlen($name) == 0) $name = "anonymous";
	    if (strlen($name) > 12) $name = substr($name, 0, 12);

	    $res = mysqli_query($db, "SELECT * FROM main ORDER BY score DESC");

	    // test if theres a equal entry in the database
	    $equalentry = false;
	    while ($row = mysqli_fetch_assoc($res)) {
	        if ($row['nickname'] == $name && $row['score'] == $score) {
	        	$equalentry = true;
	        	break;
	        }
	    }

	    if (!$equalentry) mysqli_query($db, "INSERT INTO main(id, nickname, score) VALUES('$id', '$name', '$score')");
	}

	mysqli_close($db);
?>

