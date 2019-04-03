<?php
$navKey = "guides";
include_once '../includes/html-helpers.php';
?>
<!DOCTYPE html>
<html lang="en">
    <head lang="en">
        <?php
        meta_and_links("ag-Grid Guides", "ag-Grid Guides", "ag-Grid Guides", true);
        ?>
        <link rel="stylesheet" href="../dist/homepage.css">
    </head>
    <body>
        <header id="nav" class="compact">
            <?php
            $version = 'latest';
            include '../includes/navbar.php';
            ?>
        </header>
        <div id="guides-page" class="info-page">
            <div class="row">
                <section>
                    <h1>Guides</h1>
                    <article>
                        <p class="lead">
                            Welcome to ag-Grid Guides.
                        </p>
                        <p>
                            Our support team have been hard at work developing a catalogue of guides and bespoke examples
                            to aid our customers with all of their ag-Grid customisation needs.
                        </p>
                        <p>
                            Here are a few we think will be most helpful to you
                        </p>
                    </article>
                    <div id="guides-carousel" class="carousel slide">
                        <ol class="carousel-indicators">
                            
                        </ol>
                        <div class="carousel-inner">
                            
                        </div>
                        <a class="carousel-control-prev" href="#guides-carousel" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a class="carousel-control-next" href="#guides-carousel" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
        <?php include_once("../includes/footer.php"); ?>
        <?php include_once("../includes/analytics.php"); ?>
        <script src="../dist/homepage.js"></script>
    </body>
</html>
