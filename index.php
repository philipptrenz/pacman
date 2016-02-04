<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- prevent users to zoom -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

    <meta name="description" content="Pac-Man - A simple HTML5 Browser Game">
    <meta name="author" content="Philipp Trenz">

    <title>Pac-Man</title>

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="http://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css">
    <link href="http://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic" rel="stylesheet" type="text/css">

</head>

<body id="page-top" class="index">

    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#page-top">Pac-Man</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li class="hidden">
                        <a href="#page-top"></a>
                    </li>
                    <li class="page-scroll">
                        <a href="#play">Play</a>
                    </li>
                    <li class="page-scroll">
                        <a href="#highscore">Highscore</a>
                    </li>
                    <li class="page-scroll">
                        <a href="#instructions">Instructions</a>
                    </li>
                    <li class="page-scroll">
                        <a href="#about">About</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <img class="img-responsive" src="img/profile.png" alt="">
                    <div class="intro-text">
                        <span class="name">Pac-Man</span>
                      
                        <span class="skills">- A HTML5 Browser Game -</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Play Section -->
    <section id="play">
        <div class="container">
            <div class="row">

                <!-- HTML5 Canvas -->
                <div id="game-wrapper">
                    <div id="game-status">
                        <div id="game-options">
                            <button type="button" onclick="savegame()" id="savegame"><i class="fa fa-floppy-o"></i></button>
                            <button type="button" onclick="loadgame()" id="loadgame"><i class="fa fa-undo"></i></button>
                        </div>
                        <div id="lifes"></div>
                    </div>

                    <canvas id="game" class="img-responsive" width="800" height="600" onclick="toggleRunning()"></canvas>
                </div>

                <div id="controls" class="visible-xs visible-sm">
                    <a onclick="buttonClick(1)">
                        <div class="up control">
                            <i class="fa fa-arrow-up"></i>
                        </div>
                    </a>
                    <br />
                    <a onclick="buttonClick(4)">
                        <div class="left control">
                            <i class="fa fa-arrow-left"></i>
                        </div>
                    </a>
                    <a onclick="buttonClick(3)">
                        <div class="down control">
                            <i class="fa fa-arrow-down"></i>
                        </div>
                    </a>
                    <a onclick="buttonClick(2)">
                        <div class="rigth control">
                            <i class="fa fa-arrow-right"></i>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Highscore Section -->
    <section class="success" id="highscore">
        <div class="container">

            <div class="page-scroll" style="display: none;">
                <a href="#highscore" id="shadowlink"></a>
            </div>
            

            <!-- DATABASE CONNECTION-->
            <?php
                require_once ('config.php');

                // defines how many results from the database will be shown.
                $maxResults = 15;

                @$db = mysqli_connect(
                                     MYSQL_HOST, 
                                     MYSQL_USER, 
                                     MYSQL_PASSWORD, 
                                     MYSQL_DATABASE
                                    );
            ?>

            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>Highscore</h2>
                    <hr class="star" style="max-width: 40%">
                    
                    <?php 
                        if (mysqli_connect_errno($db)) {
                            echo "<p>Sorry, no connection to database ...</p>";
                        } else {
                            echo("<p>Here you see the best $maxResults players for now!</p>");
                        }

                        mysqli_query($db, "CREATE TABLE IF NOT EXISTS `main` (
                                            `id` int(11) NOT NULL,
                                            `nickname` varchar(20) COLLATE utf8_bin NOT NULL,
                                            `score` int(11) NOT NULL,
                                            `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
                                            )");
                    ?>
                            
                </div>
            </div>

            <div class="row">
                <div class="highscore table">
                    <div class="highscore table-row">
                        <div class="highscore table-cell"><h3>Name</h3></div>
                        <div class="highscore table-cell"><h3>Score</h3></div>
                        <div class="highscore table-cell"><h3>Date</h3></div>
                    </div>

                    <div class="highscore table-row" id="register" style="display: none; height: 65px;">              
                        <div class="highscore table-cell">
                            <div style="display: inline; position: absolute; padding: 0 -80px;"></i></div>
                            <form action="#highscore" method="post" id="highscore">
                                <input type="text" name="name" id="nickname">
                                <input name="score" id="score" value="none" style="visibility: hidden; position: absolute;">
                                <input name="date" id="date" value="none" style="visibility: hidden; position: absolute;">
                                <input type="submit" id="submit" value="Send">
                            </form>

                        </div>
                        <div class="highscore table-cell" id="showHighscore"></div>
                        <div class="highscore table-cell" id="showDate">today</i></div>
                    </div>
                    
                    <?php


                        if ($_POST) {

                            // get max id from database
                            $res = mysqli_query($db, "SELECT MAX(id) AS 'maxid' FROM main");
                            $row = mysqli_fetch_assoc($res); 

                            $id = 0;
                            if ($row) $id = $row['maxid']+1;

                            $name = $_POST['name'];
                            $score = $_POST['score'];

                            $res = mysqli_query($db, "SELECT * FROM main ORDER BY score DESC");

                            // test if theres a equal entry in the database
                            $equalentry = false;
                            while ($row = mysqli_fetch_assoc($res)) {
                                if ($row['nickname'] == $name && $row['score'] == $score) $equalentry = true;
                            }

                            if (!$equalentry) mysqli_query($db, "INSERT INTO main(id, nickname, score) VALUES('$id', '$name', '$score')");
                        }
                        

                        $res = mysqli_query($db, "SELECT * FROM main ORDER BY score DESC");

                        $i = 0;

                        for ($i = 0; $i < $maxResults; $i++) {


                            if ($row = mysqli_fetch_assoc($res)) {
                                echo "<div class='highscore table-row'>";
                            
                                if (in_array($row['nickname'], $row)) {
                                    echo "<div class='highscore table-cell'>".$row['nickname']."</div>";
                                }
                                if (in_array($row['score'], $row)) {
                                    echo "<div class='highscore table-cell'>".$row['score']."</div>";
                                }
                                if (in_array($row['date'], $row)) {
                                    $date = date('M j Y', strtotime($row['date']));
                                    echo "<div class='highscore table-cell'>".$date."</div>";
                                }

                                echo "</div>";
                            } else {
                                break;
                            }

                        }

                        mysqli_close($db);
                    ?>
                
                </div>
            </div>
        </div>
    </section>

    <!-- Instructions Section -->
    <section id="instructions">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>Instructions</h2>
                    <hr class="star" style="max-width: 40%">
                </div>
            </div>

            <!-- Instructions for large devices -->
            <div class="row">
                <div class="col-lg-4 col-lg-offset-2">
                    <p>The game is inspired by the original arcade game. You control Pac-Man through a maze, eating pac-dots. When all pac-dots are eaten, Pac-Man gets to the next level.<br />
                    Three ghosts roam the maze. If Pac-Man cames too close to them, they will persecute him. But although they are ghosts, they can't look through walls, so be fast and escape them! If a ghost touches Pac-Man, you lose a life and the level starts from beginning.<br />
                    When you lost the last life, the game is over.</p>
                </div>

                <div class="col-lg-4">
                    <h3 style="margin-top: 0;">Controls:</h3>
                    <p>You control Pac-Man with the arrow keys on your keyboard and on mobile with <i class="fa fa-arrow-up" style="padding: 0 5px;"></i><i class="fa fa-arrow-right" style="padding: 0 5px;"></i><i class="fa fa-arrow-down" style="padding: 0 5px;"></i><i class="fa fa-arrow-left" style="padding: 0 5px;"></i>. <b>Use the spacebar</b> or <b>tab at the pitch</b> for pausing the game and skipping the messages.<br />
                    With <i class="fa fa-floppy-o" style="padding: 0 5px;"></i> you can save your current level and your lifes, with <i class="fa fa-undo" style="padding: 0 5px;"></i> you load it again. You can save only one state at once, so choose wisely!<br />
                    When you finished the game you will get to the highscore list, where you can enter your name.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="success" id="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2>About</h2>
                    <hr class="star" style="max-width: 40%">
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-lg-offset-2">
                    <p>Hi, I'm Philipp.<br />
                    I'm a student of media informatics at the Harz University of Applied Science in Germany. My course of studies combines design and computer sience, which fits perfectly with my interests. This game is one of my student projects from the second year (third semester). It shows the power of HTML5, JavaScript and modern web browsers. The game has just about 20 kilobytes of code plus some images and runs completely in your browser!</p>
                </div>
                <div class="col-lg-4">
                    <p>I published the code as Open Source at GitHub, so if you like it: Fork it, change it, improve it! Or just come back for a bit of playing ;)<br />
                    If you have ideas or found a bug, please feel free to contact me via mail or Twitter.<br />
                    If you want to know more about me and my interests, take a look at my website (only German, sorry!).<br />
                    <br />
                    <b>Thanks for stopping by!</b>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="text-center">
        <div class="footer-above">
            <div class="container">
                <div class="row">
                    <div class="footer-col">
                        <ul class="list-inline">
                            <li>
                                <a href="https://github.com/philipptrenz/pacman" class="btn-social btn-outline" target="_blank"><i class="fa fa-fw fa-github"></i></a>
                            </li>
                            <li>
                                <a href="http://twitter.com/philipptrenz" class="btn-social btn-outline" target="_blank"><i class="fa fa-fw fa-twitter"></i></a>
                            </li>
                            <li>
                                <a href="http://philipptrenz.de" class="btn-social btn-outline" target="_blank"><i class="fa fa-fw fa-home"></i></a>
                            </li>
                            <li>
                                <a href="mailto:mail@philipptrenz.de" class="btn-social btn-outline" target="_blank"><i class="fa fa-fw fa-envelope"></i></a>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-below">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        &copy; Philipp Trenz 2016
                    </div>
                </div>
            </div>
        </div>
    </footer>


    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Plugin JavaScript -->
    <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
    <script src="js/classie.min.js"></script>
    <script src="js/cbpAnimatedHeader.js"></script>

    <!-- Custom Theme JavaScript -->
    <script src="js/style.min.js"></script>

    <!-- Game JavaScript -->
    <script src="js/game.js" type="text/javascript" /></script>

</body>

</html>
