<?php
include 'csv.php';

$json = '{"title":"MyDrawing","width":"500","height":"400","objects":[{"type":"circle","x1":"12","y1":"13","x2":"","y2":"","radius":"25","color":"#65d676"},{"type":"line","x1":"11","y1":"15","x2":"24","y2":"25","radius":"","color":"#a3a61e"}]}';

//$a = new CSV($json);
CSV::loadFromFile($json);