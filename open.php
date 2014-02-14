<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST" enctype="multipart/form-data">
<input type="file" name="file" id="file">
<input type="submit" name="submit" value="submit">
</form>


<?php

if(isset($_REQUEST['submit']) && $_REQUEST['submit']=='submit'){
	if ( isset($_FILES["file"])) {

            //if there was an error uploading the file
        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br />";

        }
        else {
                 //Print file details
             echo "Upload: " . $_FILES["file"]["name"] . "<br />";
             echo "Type: " . $_FILES["file"]["type"] . "<br />";
             echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
             echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";
             $a = array();
            ini_set('auto_detect_line_endings',TRUE);
				$handle = fopen($_FILES["file"]["tmp_name"],'r');
				 while ( ($data = fgetcsv($handle) ) !== FALSE ) {
					$a[] = $data;	
				}
			ini_set('auto_detect_line_endings',FALSE);
			echo "<pre>"; print_r($a); echo "</pre>";
        }
     } else {
             echo "No file selected <br />";
     }
}