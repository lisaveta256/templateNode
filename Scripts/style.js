	   
	 
	 $(document).ready(function () { 



		rep1=$("#filter");		 
		rep1.css('transform','scale(0)');

		 $("body").bind("click",h); 
		 function h(ev){
			
			 f=ev.target.tagName;
			 f_id=ev.target.id;
		//	 console.log(f);
			
			 rep=$("#reportEquipmentDataTable");
			 repCss=rep.css("visibility");
			 
	//		  console.log(repCss);	
			if 	(f!=="IMG"){
		
					if (f!=="INPUT"){
						if (f!=="A"){
							if(f!=="SELECT"){

							
					if(f_id!=="eQuipmentTBody"){
						if ( (rep1.css("visibility")=="visible") && (f_id=="filter") ){
							console.log('This is filter ' +f_id)
						}else{
						h22();	
						}
						
			 if (repCss=="visible"){
				 repCss=rep.css("visibility","hidden");
					 $("[id=eQuipmentTBody").css('visibility','hidden');	
					 $("[id=reportEquipmentDataTable").css('transform','scale(0)');	
					 $("[id=reportEquipmentDataTable").css('transition','transform 500ms');	
					
			 }
			
			}
		}
			}
		 }
		}
		 

		}


		$("[id=reportEquipmentDataTable").css('transform','scale(0)');	
		$("[id=reportEquipmentDataTable").css('transition','transform 500ms');	
$("#sett").bind("click",h1); 
		 function h1(ev){
			
			 rep=$("#reportEquipmentDataTable");
			 repCss=rep.css("visibility");
		
			 if (repCss=="hidden"){
				 repCss=rep.css("visibility","visible");
						 $("[id=eQuipmentTBody").css('visibility','visible');	
						 repCss.css('transform','scale(1)');	
				 	
			 }
			
		 }

if( $("[id=reportEquipmentDataTable").css('visibility')=='hidden')
{
	$("[id=eQuipmentTBody").css('visibility','hidden');	
}
else{						
		$("[id=eQuipmentTBody").css('visibility','visible');	
}


 
$("#fi").bind("click",h2); 
		 function h2(ev){
	
			
			
			 repCss=rep1.css("visibility");
			 if (repCss=="hidden"){
				 rep1.css("visibility","visible");
				 rep1.css('transform','scale(1)');	
				 rep1.css('transition','transform 500ms');		
			 }else{
				h22();	
					
			}
			
		 }
		 function h22(ev){
	
			
		
			   rep1.css("visibility","hidden");
			   rep1.css('transform','scale(0)');
			   rep1.css('transition','transform 500ms');		
				   
		   
		   
		}

		
})		