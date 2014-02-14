<?php
require_once 'csv_interface.php';
class CSV implements csvInterface
{
		
	CONST DELIMITER_COL = ",";
	CONST DELIMITER_ROW = "\n";

	protected $_Csv = array();
	protected $_CursorPosition = 0;
	protected $_Title = "";
	protected $_Width = 0;
	protected $_Height = 0;

	function __construct($strCsv)
	{
		$this->postData($strCsv);		
	}

	public static function loadFromFile ( $path ){
		new CSV($path);
	}

	public function postData($data)
	{
		$postCsv = json_decode($data);
		 $csvName = $postCsv->title."_".$postCsv->width."_x_".$postCsv->height;
		 
		$csvFile = fopen('php://memory', 'w');
		foreach ($postCsv->objects as $key) {
			$preData = get_object_vars($key);
			fputcsv($csvFile, $preData, CSV::DELIMITER_COL, CSV::DELIMITER_ROW);
		}
		fseek($csvFile, 0);
		header('Content-Type: application/csv');
		header('Content-Disposition: attachement; filename="'.$csvName.'.csv";');
		fpassthru($csvFile);
	}

	public function moveFirst (){

	}

	public function moveLast(){

	}

	public function moveNext (){

	}

	public function movePrev (){

	}

	public function getRow (){

	}

	public function deleteRow (){

	}

	public function appendRow ($row){

	}

	public function getCsv (){

	}

	public function getCsvName (){

	}

	public function setCsvName ($name){
		$this->csvName = $name;
	}

}