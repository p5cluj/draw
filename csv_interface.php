<?php
interface csvInterface {
	
	public function moveFirst ();
	public function moveLast();
	public function moveNext ();
	public function movePrev ();
	public function getRow ();
	public function deleteRow ();
	public function appendRow ($row);
	public function getCsv ();
	public function getCsvName ();
	public function setCsvName ($name);
}