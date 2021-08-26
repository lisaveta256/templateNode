$(document).ready(function () {
	var hostName = 'DESKTOP-V3RHJ99:5000'; // desktop-v3rhj99:5000 18rrniis08:9000   izo0273.izovac.local:7000
	var pcName = 'Ortus';


	createReportRowsTable();
	var String1, String2;


	$("#reportProcTable").css("visibility", "hidden");
	$('#reportRowTBody').css("visibility", "hidden");
	$('#reportRowsTable').css("visibility", "hidden");
	// console.log(String2);


	width = $(".div70").width() - document.getElementById("table-cont").offsetWidth;
	$("#operationContainer").width(width - 53 + "px"); //


	var url_address = "http://" + hostName + "/api/Reports/"; //18rrniis08:9000   izo0273.izovac.local:7000

	$('#panel_show').hide();
	$('#click_me').click(function () {
		$('#panel_show').show();
	});
	$('#close_me').click(function () {
		$('#panel_show').hide();
	});


	$("body").bind("click", cl);

	function cl(ev) {
		tgt = ev.target.tagName;
		rep = $("#panel_show");
		repCss = rep.css("width");
		//		  console.log(repCss);	
		if (tgt !== "IMG") {
			if (tgt !== "A") {
				if (repCss == "200px") {
					$('#panel_show').hide();
				}
			}

		}
	}

	outPutEquipmentData()
	$('#equipmentLabel').click(function () {
		outPutEquipmentData()
	})

	function AutoRun(name) {


		$('#CurrentEquipment').text(name);
		//LoadAppropriateEquipment(name);
		UploadProcessRreportRowDataTemplate(name);
		clearReportRowTable();
		/*моё*/
		
		GetEquipmentDataByName(name);
		GetReportProcessByEquipmentName(name);
		$(".filter").css('display', 'inline-block');
		if ($("[id=reportProcTable").css('visibility') == 'hidden') {
			$("[id=reportProcTable").css('visibility', 'visible')
		}
		if ($("[id=reportProcTable2").css('visibility') == 'hidden') {
			$("[id=reportProcTable2").css('visibility', 'visible')
		}
	}

	function outPutEquipmentData() {
		$.ajax({
			url: url_address + 'GetEquipmentNames',
			type: 'Get',
			dataType: 'json',
			success: function (data, textStatus, xhr) {
				$('#EquipmentData').empty();
				$('#CurrentReportName').empty();
				data.forEach(function (item, i) {
					//alert(item.Equipment.MachineName)				
					if (i == 0) {
						
						AutoRun(item.Equipment.MachineName);
					}
					$('#EquipmentData').append('<li><a href="#;"id="' + item.Equipment.MachineName + 'Button";>' + item.Equipment.MachineName + '</a></li>');
					addEventListenerOnButton(item.Equipment.MachineName + 'Button');
				})

			},
			error: function (xhr, textStatus, errorThrown) {
				$('#EquipmentData').empty();
				$('#EquipmentData').append('<li><a href="#">Сервер не доступен!</a></li>');
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}

	function addEventListenerOnButton(id) {
		unb = document.getElementById(id);

		$(unb).bind("click", function () {
			if (this.text != $('#CurrentEquipment').text()) {
				$('*[id^="prefButtonLsDt"]').remove();
				$('*[id^="prefButtonZkDt"]').remove(); /*добавила*/
				document.getElementById("for_load_process").innerHTML='';
				AutoRun(this.text);
				//$(unb).unbind("click");
			}
		});


	}

	function GetReportProcessByEquipmentName(name) {
		
		$.ajax({
			url: url_address + 'GetReportProcess',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				equipmentName: name
			},
			success: function (data, textStatus, xhr) {
				
				if (data!=null){
				GetReportProcessData(data)
				}

			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}

	function GetEquipmentDataByName(name) {
	//	$('footer').prepend('<script type="text/javascript" src="Data\\Items.js"></script>');



		$.ajax({
			url: url_address + 'GetEquipmentByName',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				name: name
			},
			success: function (data, textStatus, xhr) {

				addEquipmentData(data)

			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}

	function GetReportRowDataByReportName(name) {
		document.getElementById('reportRowTableArea').innerHTML = "";
		if (document.getElementById('reportRowTBody') == null) {
			createReportRowsTable();
		}

		

		//	
		// switch($('#CurrentEquipment').text().toLocaleLowerCase()){
		// 	case "lidiz":newUrl="18izv06";
		// 	break;
		// 	case "izo0241":newUrl="masterpc";
		// 	break;
		// 	default :newUrl=$('#CurrentEquipment').text();
		// 	break;
		// }
		// //;
		//  let url_address="http://"+newUrl+":9000/api/Reports/";
		$.ajax({
			url: url_address + 'GetReportRows',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				reportName: name,
				equipmentName: $('#CurrentEquipment').text()
			},
			success: function (data, textStatus, xhr) {
				clearReportRowTable();
				//;
				$('#customDataHtmlContainer').css("visibility", "visible");
				GetReportRowData(data);


			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}

	function GetReportRowStatisticByReportName(name) {

		createSelect();
		let divForSVG = document.createElement("div");
		divForSVG.setAttribute("id", "divForSVG");
		document.getElementById("reportRowTableArea").append(divForSVG);
		getTrends();

		$("#DrawSVG").change(function () {
			document.getElementById("divForSVG").innerHTML = "";
			getTrends();


		});


		function getTrends() {
			var axisValueName = $("#DrawSVG").val();
			// console.log(axisValueName);
			if (axisValueName == null || axisValueName == "" || axisValueName == 0) {
				axisValueName = 'ABS_rIGlow';
			}
			//let a='ABS_rIGlow';
			$.ajax({
				url: url_address + 'GetReportRowStatisticByReportName',
				type: 'Get',
				dataType: 'json',
				async: true,
				data: {
					equipmentName: $('#CurrentEquipment').text(),
					reportName: name,
					firstColumnName: 'Date',
					secondColumnName: axisValueName

				},
				success: function (data, textStatus, xhr) {

					WriteChartDiagram(data["ReportRowStatistic"], axisValueName, axisValueName);


				},
				error: function (xhr, textStatus, errorThrown) {
					console.log(xhr)
					console.log(textStatus)
					console.log(errorThrown)
					return;
				}
			});
		}

		//duebugger

	}

	function PostCommentForReports(id, note) {

		let msg = "?equipmentName=" + $('#CurrentEquipment').text() + "&reportName=" + id;
		console.log(msg + note)
		$.ajax({
			url: url_address + 'PostComment' + msg,
			type: 'Post',
			contentType: 'application/json',
			data: JSON.stringify(note),
			success: function () {
				console.log("Good job!")
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});

	}


	function GetOperationDataByReportName(equipmentName, name, reportName) {

		$.ajax({
			url: url_address + 'GetOperationDataByReportName',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				reportName: reportName,
				name: name,
				equipmentName: $('#CurrentEquipment').text()
			},
			success: function (data, textStatus, xhr) {;
				var tableName = Object.keys(data)[0];
				var tableData = data[tableName];
				Object.keys(tableData).forEach(function (item) {
					alert(1);
					var myEle = $('#dynamic' + item)
					if (myEle.val() != null) {
						myEle.val(tableData[item]);
					}
				})
				//GetReportRowData(data);
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}


	function GetReportRowOperationTypes(equipmentName, reportName) {
		$("#for_load_process").html('');
		$.ajax({
			url: url_address + 'GetReportRowOperationTypes',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				equipmentName: equipmentName,
				reportName: reportName
			},
			success: function (data, textStatus, xhr) {


				$('#CurrentOperation').text('');
				$('*[id^="prefButtonLsDt"]').unbind("click");
				$('*[id^="prefButtonLsDt"]').remove();
				$("#customDataHtmlContainer").css("border-left-color", "white");

				data.OperationTypes.forEach(function (item) {
					let type = data.Difinition[item.name];
					console.log("1")
					
					$('#buttonblock1').append('<li class="load_li" id="prefButtonLsDt' + item.name + '"><a class="load_a" href="#">' + type + '</a></li>')
					let element=$("#prefButtonLsDt"+item.name)
					console.log(element)
					GetDataByOperationName($('#CurrentEquipment').text(), $('#CurrentReportName').text(), item.name, element)

				});

				$('*[id^="prefButtonLsDt"]').click(function () {
					
					let loadType = this.id;
					loadType = loadType.slice(14);
					//console.log(loadType);
					GetDataByOperationName($('#CurrentEquipment').text(), $('#CurrentReportName').text(), loadType, this)

				//	$('#CurrentOperation').text(loadType);

				})

			},
			error: function (xhr, textStatus, errorThrown) {
				$('#CurrentOperation').text('');
				$('*[id^="prefButtonLsDt"]').unbind("click");
				$('*[id^="prefButtonLsDt"]').remove();
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}


	function GetDataByOperationName(equipmentName, reportName, tableName, hideElement) {
		$("#for_load_process").html('');
		this.hideElement = hideElement;
	//	$('*[id^="prefFieldZkDt"]').remove();
	//	$('*[id^="prefButtonZkDt"]').remove();
		$.ajax({
			url: url_address + 'GetDataByOperationName',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				equipmentName: equipmentName,
				reportName: reportName,
				tableName: tableName
			},
			success: function (data, textStatus, xhr) {


				$('*[id^="prefButtonZkDt"]').unbind("click");
				//$('*[id^="prefButtonZkDt"]').remove();

				if (data != null) {
					data.OperationsNames.forEach(function (item) {

						newHide = document.createElement("div");
						newHide.setAttribute("class", "btn");
						newHide.id = 'prefButtonZkDt_' + item.id;
						newHide.innerHTML = '<a class="text" href="#" id="' + tableName + '">' + item.name + '</a>';
						hideElement.after(newHide);
						// console.log(tableName);

					})

				}

				
				$('*[id^="prefButtonZkDt"]').click(function (event) {
					$("#customDataHtmlContainer").css("border-right-color", "white");
					/*zzzz*/
					$('#CurrentOperation').text(event.target.id);
					GetDataByOperationById(this.id)			
					
				})
				$('*[id^="prefButtonZkDt"] a').click(function (event) {
					$('#CurrentOperation').text(this.id);
					console.log("1111")
					GetHtml(this.id);
				})


			},
			error: function (xhr, textStatus, errorThrown) {
				$('*[id^="prefButtonZkDt"]').unbind("click");
				$('*[id^="prefButtonZkDt"]').remove();
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}

	// $(function() {
	// 			$('#equipmentLabel').on('click', function() {
	// 			 //

	// 			});
	// 		  });


	function GetDataByOperationById(id) {

		//GetHtml(id);
		$('#for_load_process').html("")
		$.ajax({
			url: url_address + 'GetDataByOperationById',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				equipmentName: $('#CurrentEquipment').text(),
				tableName: $('#CurrentOperation').text(),
				id: id.substring(15)
			},
			success: function (data, textStatus, xhr) {
				// GetHtml ();
				Object.keys(data.Operation).forEach(function (item) {
					try {

				//	let checkItem=ifPressure(data.Operation,item);
				
					$('#prefFieldZkDt_' + item).val(convertToFloatTo2(data.Operation[item]));
						

					/*	regI = /wHeatingMode|wGas1_wMode|wDeviceNum/img;
						testI = regI.test(data.Operation[item]);
						if (testI) {*/
						/*	if (data.Operation[item] == "False") {
								g45 = $("#prefFieldZkDt_" + item);
								g45.removeClass("active");
								g45.addClass("nactive");
							} else {
								g45 = $("#prefFieldZkDt_" + item)
								g45.removeClass("nactive");
								g45.addClass("active");
							}*/

						switch(item){
							case "wDevice":
							unPuckButton(data.Operation[item],"prefFieldZkDt_wDevice",3);
							break;
							case "wGas1_wMode":
							unPuckButton(data.Operation[item],"prefFieldZkDt_wGas1_wMode",3);
							break;
							case "wGas2_wMode":
							unPuckButton(data.Operation[item],"prefFieldZkDt_wGas2_wMode",3);
							break;
							case "wGas3_wMode":
							unPuckButton(data.Operation[item],"prefFieldZkDt_wGas3_wMode",3);
							break;
							case "xGas1_Use":
							unPuckButton(data.Operation[item]=="True"?1:0,"prefFieldZkDt_xGas1_Use",2);
							break;
							case "xGas2_Use":
							unPuckButton(data.Operation[item]=="True"?1:0,"prefFieldZkDt_xGas2_Use",1);
							break;
							case "xGas3_Use":
							unPuckButton(data.Operation[item]=="True"?1:0,"prefFieldZkDt_xGas3_Use",1);
							break;
							case "wMode":
							unPuckButton(data.Operation[item],"prefFieldZkDt_wHeatingMode",3);
							break;
							case "xControl":
							unPuckButton(data.Operation[item]=="True"?1:0,"prefFieldZkDt_xControl",1);
							break;
							case "wXWaveform":
							WafeForm(data.Operation[item],"prefFieldZkDt_wXWaveform")
							break;
							case "wYWaveform":
							WafeForm(data.Operation[item],"prefFieldZkDt_wYWaveform")
							break;	
							case "wSweepMode":
							SweepMode(data.Operation[item],"prefFieldZkDt_wSweepMode")
							break;							
							
							default:
							break;

						}
							

							$("a.active").css({
								'background': '#c1f8d9',
								'color': 'rgb(22,32,43)',
								'box-shadow': 'inset 1px 1px 3px rgba(0,10,20,.5)',
								'pointer-events': 'none',
								'border': '1px solid gray'
							});

							if (item == "xControl") {
								$("#prefFieldZkDt_xControl").css({
									'width': '120px'
								});
								$("#prefFieldZkDt_xControl.nactive").text("Контроль по току");
								$("#prefFieldZkDt_xControl.active").text("Контроль по скорости");
								if ($("#prefFieldZkDt_xControl.nactive").text() == "Контроль по току") {
									$("#LayerMode").css("display", "none");
									$("#pid").css("display", "none");
								} else {
									$("#LayerMode").css("display", "inline-block");
									$("#pid").css("display", "inline-block");

								}

							}

							//g45.addClass("nactive");
							$("a.nactive").css({
								'color': 'black',
								'display': 'inline-block',
								'text-decoration': 'none',
								'line-height': '17px',
								'padding': '2px',
								'margin': '2px',
								'text-align': 'center',
								'outline': 'none',
								'border-radius': '2px',
								'background': 'rgba(167, 175, 173,0.4)',
								'font-size': '10px',
								'border': '1px solid gray',
								'box-shadow': '1px 1px 5px rgb(167, 175, 173)'
							});

							if (item == "xControl") {
								$("#prefFieldZkDt_xControl").css({
									'width': '120px'
								});
							}


					/*	}*/
					} catch {

					}

				})


			},
			error: function (xhr, textStatus, errorThrown) {

				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}


	function GetHtml(id) {
		$('*[id^="prefFieldZkDt"]').remove();
		//$('#for_load_process').html("")/*
		/* new *//*
		var oReq = new XMLHttpRequest();
		oReq.open("get", "/Templates/"+id.toLocaleLowerCase()+".html", true);
		oReq.send();
		oReq.onreadystatechange= function (){
			console.log(oReq.status);
			if (oReq.status=="200"){
			  oReq.onload = function(){
				
				$('#for_load_process').append(this.responseText)
				$('#for_load_process').css("visibility", "visible");
				Style();
				SizeFor_load_process();
			  };
			}else{
			  
			  return;
			}
		}
*/
		

		
		switch($('#CurrentEquipment').text().toLocaleLowerCase()){
			case "lidiz":newUrl="18izv06";
			break;
			case "izo0241":newUrl="masterpc";
			break;
			default :newUrl=$('#CurrentEquipment').text();
			break;
		}
		 //let url_address="http://"+newUrl+":9000/api/Reports/";
		$.ajax({
			url: url_address + 'GetHtml',
			type: 'Get',
			dataType: 'json',
			async: true,
			data: {
				name: $('#CurrentOperation').text()
			},
			success: function (data, textStatus, xhr) {
				$('#for_load_process').html("")
				$('#for_load_process').append(data.Html)
				$('#for_load_process').css("visibility", "visible");
				Style();
				SizeFor_load_process();

			},
			error: function (xhr, textStatus, errorThrown) {

				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});
	}


	function GetReportRowData(data) {
			
		this.data = data;
		var newId = 'ReportRowData';
		var id = 'reportRowTBody';
		var idThead = 'reportRowHead';
		let itemReport;
		tr = document.createElement("tr");

		String2.forEach(function (item) {
			let itemRow;
			td = document.createElement("td");
			td.setAttribute("class", item);
			_columnProperty = getValueByKey(item, data.Difinition);
			if (_columnProperty != null && _columnProperty != undefined) {
				itemRow = _columnProperty[0].XmlValue
			}else{
				itemRow=item;
			}
			td.innerText = itemRow;
			td.classList.add("darkgray");
			tr.prepend(td);
			if (item!="TimeCol"){
				td.setAttribute("style","display:none");
			}
		});


		/*createItemCheckBox(String2);*/

		$("#reportRowHead").append(tr);

		data.ReportRow.forEach(function (report) {
			tr = document.createElement("tr");

			String2.forEach(function (item) {
				//					;
				td = document.createElement("td");
				td.setAttribute("class", item);

				let regPressure=/(Pressure)/img;
				let IfPressure=regPressure.test(item);
			
				if (IfPressure){

				//console.log("Соответствие"+item);

					ourPress = document.getElementById(item);
					p = report[item];
					if (p != null) {
						td.innerText = convertPressure(p) + "";
					} else {
						td.innerText = '0';
					}


				} else {
					if (report[item] != null) {
						td.innerText = convertToFloatTo2(report[item]);
					} else {
						td.innerText = report[item];
					}


				}


				td.classList.add("grey");
				//					;
				tr.prepend(td);
				if (item!="TimeCol"){
					td.setAttribute("style","display:none");
				}
				
			});
			

			$("#reportRowTBody").prepend(tr);
			
		});
		$('#customDataHtmlContainer').css("visibility", "visible");
		$('#reportRowsTable').css("visibility", "visible");
		$('#reportRowTBody').css("visibility", "visible");

		/*стиль таблицы */
		$("#reportProcTable").css("visibility", "visible");
		Size();
		createItemCheckBox(String2);
	}

	function GetReportProcessData(data) {
		document.getElementById('reportProcHead').innerHTML="";
		document.getElementById('reportProcessTBody').innerHTML="";
		this.data = data;

		var newId = 'ReportProcessReportData';
		var id = 'reportProcessTBody';
		var idThead = 'reportProcHead';
		var count = 0;


		Size();
		tr = document.createElement("tr");

		String1.forEach(function (item) {

			td = document.createElement("td");
			td.setAttribute("id", item);

			_columnProperty = getValueByKey(item, data.Difinition);
			if (_columnProperty != null && _columnProperty != undefined) {
				item = _columnProperty[0].XmlValue
			}

			td.innerText = item;
			if ( (item == "Дата") | (item == "Date") ) {
				but = document.createElement("button");
				img = document.createElement("img");
				img.src = "Css/Images/reload.png";
				but.append(img);
				but.setAttribute("id", "reload");
				td.prepend(but);

			}

			td.setAttribute("class", "darkgray");
			tr.prepend(td);

		});
		$("#reportProcHead").append(tr);

		data.ReportProcess.forEach(function (process, iter) {

			v = process["ReportName"];
			var newId = 'ReportProcessReportValue';
			newId = newId + iter;
			//		createTrElement(id,newId,tdFieldElement,tdvalueElement);

			tr = document.createElement("tr");
			String1.forEach(function (item) {
				td = document.createElement("td");
				if (item == "Comment") {
					input = document.createElement("input");
					di = document.createElement("div");
					di.setAttribute("data-title", "huig");
					di.setAttribute("class", "input-wrapper");
					input.value = process[item];
					input.setAttribute("class", "node");
					input.setAttribute("id", v);
					di.append(input);
					td.append(di);


					/**/


				} else {

					td.innerText = process[item] + "";
				}
				td.setAttribute("class", "grey");

				td.setAttribute("id", v);
				tr.prepend(td);

			});
			if (process["RecipeName"] != "-") {
				$("#reportProcessTBody").append(tr);
			}


		});


		$('input.node').keyup(delay());
		rel = document.getElementById("reload");
		rel.addEventListener("click", f12);

		function delay() {
			var timer = 0;
			return function () {
				var context = this;
				clearTimeout(timer);
				timer = setTimeout(function () {
					InputVal.apply(context);
				}, 500 || 0);
			};
		}

		function InputVal() {

			PostCommentForReports(this.id, this.value);
			// console.log(this.id);
			// console.log(this.value);
		}

		$('.grey').click(function () {


			$("[id=reportRowTableArea").css('visibility', 'visible');


			$('#for_load_process').css("visibility", "hidden");
			$('#customDataHtmlContainer').css("visibility", "hidden");
			$('#CurrentReportName').empty();
			// $('#CurrentReportName').text($('#'+this.id).text());
			$('#CurrentReportName').text(this.id);

			clearReportRowTable();
			$('*[id^="prefButtonZkDt"]').remove(); /*добавила*/
			document.getElementById("for_load_process").innerHTML='';
			let recipeTableView = $("input[name='recipeTableView']:checked").val();

			document.getElementsByName('recipeTableView').forEach(function (elem) {
				elem.addEventListener('change', function () {
					recipeTableView = $("input[name='recipeTableView']:checked").val();

				});
			});
			if (recipeTableView == "table") {

				GetReportRowDataByReportName(this.id);
			} else {
				GetReportRowStatisticByReportName(this.id);

			}


			GetReportRowOperationTypes($('#CurrentEquipment').text(), this.id);

			this.parentNode.parentNode.childNodes.forEach(function (item) {
				try {
					if (item.tagName.toLocaleLowerCase() == 'tr')
						if (item.classList.length > 0) {
							item.classList.remove("tableSelected");
						}
				} catch (ex) {}
			})
			this.parentNode.classList.add("tableSelected");
		});

	}


	function clearReportRowTable() {
		$('#reportRowHead').empty();
		$('#reportRowTBody').empty();
	}

	function addEquipmentData(data, dictionary) {
		var newId = 'EquipmentReportData';
		var id = 'eQuipmentTBody';

		Object.keys(data.Equipment).forEach(function (item, i) {
			_columnProperty = getValueByKey(item, data.Difinition);
			var _val;

			if (_columnProperty != null && _columnProperty != undefined) {
				if (_columnProperty[1].XmlValue.toLocaleLowerCase() == 'false')

				{
					return;
				} else {
					_val = _columnProperty[0].XmlValue
				}
			}
			reg = /(sName|iState|sTime|rChamberPressure)/igm;
			res = reg.test(item);
		//	if (res == true) {
			let checkValueStateLine="";
				elementStateLine = document.getElementById(item);
				if (elementStateLine) {
					let regPressure=/(Pressure)/img;
					let IfPressure=regPressure.test(item);
				
					if (IfPressure){
	
				//	console.log("Соответствие"+item);
						p = data.Equipment[item];
						checkValueStateLine = convertPressure(p);
					}else{
						checkValueStateLine=data.Equipment[item];
					}
				elementStateLine.value = checkValueStateLine;

				}


			

			var newId = "span" + i; //'EquipmentReportData'+i;

			tdFieldElement = document.createElement('span');

			cellText = document.createTextNode(_val);
			tdFieldElement.appendChild(cellText);
			tdFieldElement.setAttribute("class", "info0");
			tdvalueElement = document.createElement('span')
			tdvalueElement.setAttribute("class", "info1");
			//tdvalueElement.setAttribute("class", "grey");
			cellText1 = document.createTextNode(data.Equipment[item]);
			tdvalueElement.appendChild(cellText1);
			tdvalueElement.setAttribute('id', 'EquipmentInfoPanel_' + item);


			createTrElementDiv(id, newId, tdFieldElement, tdvalueElement);
			$('#' + id).find('#' + newId)[0].append(tdFieldElement);
			$('#' + id).find('#' + newId)[0].append(tdvalueElement);
		})


		// 	if (data.Equipment.Key="UserName"){

		// 		valueElement=document.createElement('div');
		// 			g=document.getElementById("op");	
		// 				//cell = document.createTextNode ("Пользователь: ");
		// 	if (data.Equipment["UserName"]==null){
		// 		cellT = document.createTextNode("None");
		// 	}else{
		// 		cellT = document.createTextNode(data.Equipment["UserName"]);
		// 	}

		// 		//	valueElement.appendChild(cell);
		// 			valueElement.appendChild(cellT);
		// g.append(valueElement);
		// 	}


	}


	function getValueByKey(key, data) {
		var _result;
		// for (let item of data)	data.forEach(function(item,i){
		for (let item of data) {
			if (item.Key.toLocaleLowerCase() == key.toLocaleLowerCase()) {
				_result = item.Value;
				break;
			}

		}
		return _result;
	}


	function createTrElementDiv(id, newId, fieldName, valueName) {

		var trElement = document.createElement('div');
		trElement.setAttribute("id", newId);
		trElement.setAttribute("class", "info2");
		//var tdElement = document.createElement('td');
		//tdElement.setAttribute("class", "grey");
		//tdElement.innerHTML()

		var myElem = document.getElementById(id);
		var idExist = false;

		for (let item of myElem.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", 'div')) {

			if (item.id == newId) {
				idExist = !idExist;
				break;
			}
		}

		if (idExist) {
			//var myEleValue= myElem.value;
		} else {
			//tdElement.value=
			myElem.append(trElement);
			//document.getElementById(newId)
			//.append(tdElement);
		}
	}


	time1();

	function time1() {

		var d = new Date();
		day = d.getDate();
		month = d.getMonth() + 1;
		year = d.getFullYear();
		if (day < 10) {
			day = '0' + day;
		}
		if (month < 10) {
			month = '0' + month;
		}
		var date = (day + "." + month + "." + year);
		var date2 = (year + "-" + month + "-" + day);
		document.getElementById("date_div").innerHTML = date;
		$('#calendar_end').val(date2);
		$('#calendar_start').val(date2);
		var dat = new Date();
		var H = '' + dat.getHours();
		H = H.length < 2 ? '0' + H : H;
		var M = '' + dat.getMinutes();
		M = M.length < 2 ? '0' + M : M;
		var S = '' + dat.getSeconds();
		S = S.length < 2 ? '0' + S : S;
		var clock = H + ':' + M + ":" + S;
		document.getElementById('time_div').innerHTML = clock;

		function showTime() {
			var dat = new Date();
			var H = '' + dat.getHours();
			H = H.length < 2 ? '0' + H : H;
			var M = '' + dat.getMinutes();
			M = M.length < 2 ? '0' + M : M;
			var S = '' + dat.getSeconds();
			S = S.length < 2 ? '0' + S : S;
			var clock = H + ':' + M + ":" + S;
			document.getElementById('time_div').innerHTML = clock;
		}
		setInterval(showTime, 1000); // перерисовать 1 раз в сек.


	}


	ok = document.getElementById("filter_ok");
	res = document.getElementById("reset_filter");

	source = $("#filter_abc");

	ok.addEventListener("click", f11);
	res.addEventListener("click", f12);

	function f12() {
		$('*[id^="prefButtonZkDt"]').remove();
		cE = $('#CurrentEquipment').text();
		$("#reportProcessTBody").empty();
		$("#reportProcHead").empty();
		$('#reportRowHead').empty();
		$('#reportRowTBody').empty();
		$('#reportRowTBody').empty();
		$('#reportRowTableArea').empty();

		$('#customDataHtmlContainer').css("visibility", "hidden");
		$('#for_load_process').css("visibility", "hidden");
		clearReportRowTable();
		GetReportProcessByEquipmentName(cE);

		$(".filter").css('display', 'inline-block');
		if ($("[id=reportProcTable").css('visibility') == 'hidden') {
			$("[id=reportProcTable").css('visibility', 'visible')
		}
		if ($("[id=reportProcTable2").css('visibility') == 'hidden') {
			$("[id=reportProcTable2").css('visibility', 'visible')
		}
	}

	function f11() {
		$('*[id^="prefButtonZkDt"]').remove();
		var start = $('#calendar_start').val();
		var end = $('#calendar_end').val();
		var filter_abc = $('#filter_abc').val();

		colu = document.getElementById("col_ol").value;

		let columnSort;
		let sort;
		let radioFilter = $("input[name='sort']:checked").val();

		switch (radioFilter) {
			case "no":
				columnSort = "Date";
				sort = false;
				break;
			case "inc":
				columnSort = $("#col_sort").val();
				sort = true;
				break;
			case "desc":
				columnSort = $("#col_sort").val();
				sort = false;
				break;

		}
		// console.log("Это " + radioFilter);
		// console.log("" + columnSort);

		var parameters = {};
		if (filter_abc == "") {
			parameters = {};
		} else {
			parameters[colu] = filter_abc;
		}

		sortOptions = {
			PagingOption: {
				"Page": 1,
				"PageSize": 0
			},
			Ascending: sort,
			OrderByName: columnSort,
			SearchData: parameters
		};
		equipmentName = $('#CurrentEquipment').text();
		sort = JSON.stringify({
			sortOptions,
			equipmentName
		});
		/*нужное*/
		/*kkkk='{sortOptions: {"PagingOption": {"Page": 1,"PageSize": 0},	
		"Ascending": false, "OrderByName": "Data",
		"SearchData": { colu: filter_abc } },
			 "equipmentName": $('#CurrentEquipment').text()}';*/
		$.ajax({

			url: url_address + 'GetReportProcessSearch',
			type: 'Get',
			dataType: 'json',
			data: {
				data: sort
			},
			success: function (data, textStatus, xhr) {
				$("#reportProcessTBody").empty();
				$("#reportProcHead").empty();
				$('#reportRowHead').empty();
				$('#reportRowTBody').empty();
				$('#for_load_process').css("visibility", "hidden");
				$('#customDataHtmlContainer').css("visibility", "hidden");
				if (data!=null){
				GetReportProcessData(data);	
				}
				
			},
			error: function (xhr, textStatus, errorThrown) {
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				return;
			}
		});

	}
	source.keydown(function () {
		var filter_abc = $('#filter_abc').val();


	});


	function convertPressure(p) {
		this.p = p;
		pr = p.replace(",", ".");
		pr_ = pr.length;
		//	pr="0.000987";//data.Equipment["rChamberPressure"];
		prI = parseFloat(pr);
		pr = pr.split(".");
		pr1 = pr[0];
		pr1L = pr1.length;
		var valuePress;
		st = 0;
		if (parseInt(p) <= 0) {
			if (pr_ > 1) {
				pr2 = pr[1];
				pr2L = pr2.length;
				st = 0;
				for (i = 1; i < pr2L; i++) {

					prr = parseInt(prI);

					if (prr <= 0) {

						prI = prI * 10;
						st++;
						prI22 = parseInt(prI * 100) / 100;
						valuePress = prI22 + "e-" + st;
					}
				}
			} else {
				valuePress = 0 + "e0";
				// console.log("Давление равно 0");
			}


		} else {

			st2 = 0;
			pr1L = pr1.length;
			if (pr1L == 1) {
				//console.log("Дарова");
				prI24 = parseInt(prI * 100) / 100;
				valuePress = prI24 + "e0";

				//				console.log(valuePress)	;
			}
			for (i = 1; i < pr1L; i++) {
				prr = parseInt(prI);
				//				console.log(prr+"yf");
				if (prr >= 10) {
					prI = prI / 10;
					st2++;
					prI23 = parseInt(prI * 100) / 100;
					valuePress = prI23 + "e+" + st2;

					//					console.log(valuePress)	;
				}


			}
		}

		//	console.log(valuePress);
		return valuePress;
	}


	$("#export").bind("click", exportXML);

	function exportXML() {
		$("#iFr").css("display", "none");
		iFr.src = url_address + 'GetExcelStatistics?EquipmentName=' + $('#CurrentEquipment').text() + "&ReportName=" + $('#CurrentReportName').text() + "&IsColumn=true&CellSize=15";
	}

	function unPack(mode) {
		this.mode = mode;
		let str = "";
		let o;
		
		for (i = 0; mode > 0; i++) {
			o = mode % 2;
			mode = parseInt(mode / 2);
			str = o + str;
			// console.log(str);
		}
		massStr = str.split("");
		massStr1 = massStr.reverse();
		// console.log(massStr1);
		return massStr1;
	}

	//setInterval(GetSingalRData, 1000);
	setInterval(CurcleEquipment, 5000);
	function CurcleEquipment(){
		GetEquipmentDataByName($('#CurrentEquipment').text())
	}
	$('#CurrentEquipment').text()

	function GetSingalRData() {
		//;
		try {
			var chat = $.connection.equipmentHub;

			$.connection.hub.url = 'http://' + hostName + '/signalr/hubs';
			$.connection.hub.start().done(function () {
				//		;
				chat.server.getEquipmenData(pcName).done(function (result) { //18rrniis08:9000  izo0241
					//		;
					if (result) {
						//					;
						resultString = JSON.parse(result);
						Object.keys(resultString).forEach(function (item) {
							var res;

							let checkValueStateLine="";
							elementStateLine = document.getElementById(item);
							if (elementStateLine) {
								let regPressure=/(Pressure)/img;
								let IfPressure=regPressure.test(item);
							
								if (IfPressure){
				
							//	console.log("Соответствие"+item);
									p = resultString[item];
									checkValueStateLine = convertPressure(p) + "";
								}else{
									checkValueStateLine=resultString[item];
								}
							elementStateLine.value = checkValueStateLine;
			
							}




							// if ((item == "rChamberPressure") || (item == "rLinePressure")) {
							// 	ourPress = document.getElementById(item);
							// 	p = resultString[item];
							// 	res = convertPressure(p) + "";

							// } else {
							// 	res = resultString[item];
							// }
							if (item != "Name") {
								$('#' + item).val(checkValueStateLine);
							}

							$('#EquipmentInfoPanel_' + item).text(checkValueStateLine);

						});

					}
				});
			});
		} catch (e) {
			let inputMassive = document.getElementById("line").querySelectorAll("input");
			inputMassive.forEach(function (elem) {
				elem.value = "нет соединения";
			});
		}

	};


	function Style() {
		var height;
		let i = 0;
		$("#deposTable td div.source").each(function () {
			i++;
			if (i == 1) {
				height = $(this).closest("td").height();
			}
			$(this).height(height);


		});

		$("#deposTable td div.ntr").each(function () {

			$(this).height(height);
		});
		$(".gas").each(function () {
			$(this).height("110px");
		});

	}

	function Size() {

		let height = $("#main").height() /*-document.getElementById("f").offsetHeight*/ ;

		height = height + "px";
		$("#for_param").css("height", height);
		$("#panel_hide").outerHeight(height);
		$("#panel_show").outerHeight(height);
		
		height = $(".div70").height() - document.getElementById("reportProcHead").offsetHeight + "px";
		$("#reportProcessTBody").height(height);
	   if (document.getElementById("reportRowHead")!=null){
		 height = $(".div30").height() - document.getElementById("reportRowHead").offsetHeight + "px";
	/*	$("#reportRowTBody").height(height);*/
	/*$("#Rate").css("display","none");  */
	   }
		

	}


	function WriteChartDiagram(data, a, axisName) {
console.log(data);
data.forEach(function(d){
	console.log(d[a]);
})
console.log(a);

		this.data = data;
		this.a = a;
		this.axisName = axisName;
		// set the dimensions of the canvas
		/*var margin = {
				top: 20,
				right: 20,
				bottom: 70,
				left: 40
			},*/
			//width = 800 - margin.left - margin.right,
			//height = 300 - margin.top - margin.bottom;


		var height = 300, 
        width = 800, 
        margin=40;
      /*  data=[
            {name: "Ливерпуль", score: 54},
            {name: "Ман. Юнайтед", score: 62},
            {name: "Арсенал", score: 66},
            {name: "Челси", score: 70},
            {name: "Ман. Сити", score: 61},
        ];*/
         
    // функция для получения цветов
   
     
    // длина оси X= ширина контейнера svg - отступ слева и справа
    var xAxisLength = width - 2 * margin;     
      
    // длина оси Y = высота контейнера svg - отступ сверху и снизу
    var yAxisLength = height - 2 * margin;
     
    // функция интерполяции значений на ось X
    var xScale = d3.scaleBand()
            .rangeRound([0, xAxisLength + margin])
            .padding(0.1)
            .domain(data.map(function(d) { return d.Date; }));
     
    // функция интерполяции значений на ось Y
    var yScale = d3.scaleLinear()
        .domain([   
        d3.min(data, function(d) { return parseInt(d[a]) - 10; }),
                d3.max(data, function(d) { return parseInt(d[a])  + 10; })
        ]).range([yAxisLength, 0]);
     
		var svg = d3.select("#divForSVG").append("svg")
            .attr("class", "axis")
            .attr("width", width)
            .attr("height", height);
     
    // создаем ось X   
    var xAxis = d3.axisBottom().scale(xScale);
    /*svg.axis()
                .scale(xScale)
                .orient("bottom");*/
    // создаем ось Y             
    var yAxis = d3.axisLeft().scale(yScale)/*svg.axis()
                 .scale(yScale)
                 .orient("left")*/;
                  
     // отрисовка оси Х             
    svg.append("g")       
         .attr("class", "x-axis")
         .attr("transform",
             "translate(" + margin + "," + (height - margin) + ")")
        .call(xAxis);
     
     // отрисовка оси Y 
    svg.append("g")       
        .attr("class", "y-axis")
        .attr("transform",
                "translate(" + margin + "," + margin + ")")
        .call(yAxis);
         
    // рисуем горизонтальные линии 
    d3.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLength)
        .attr("y2", 0);
     
    // создаем элемент g с набором  столбиков
    svg.append("g")
        .attr("transform",  // сдвиг оси вправо
             "translate(" + margin + ", 0)")
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.Date); })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) { return yScale(parseInt(d[a]) )+margin; })
        .attr("height", function(d) { return height - yScale(parseInt(d[a]) )-margin-margin; })
        .attr("fill", function(d) { return "red"; });
	}


	function createSelect() {
		document.getElementById("reportRowTableArea").innerHTML = "";
		let select, option;
		select = document.createElement("select");
		select.setAttribute("id", "DrawSVG");
		String2.forEach(function (elN) {
			if (elN != "Date" && elN != "sType" && elN != "sName") {
				option = document.createElement("option");
				option.innerText = elN;
				option.setAttribute("id", elN);
				select.append(option);
			}

		});
		document.getElementById("reportRowTableArea").append(select);
	};


	function createReportRowsTable() {
		let divForTable = document.getElementById('reportRowTableArea');
		let table = document.createElement("table");
		table.setAttribute('id', "reportRowsTable");
		table.setAttribute('class', "features-table fixed_headers");
		let thead = document.createElement('thead');
		thead.setAttribute('id', 'reportRowHead');
		let tbody = document.createElement('tbody');
		tbody.setAttribute('id', 'reportRowTBody');
		table.append(thead);
		table.append(tbody);

		divForTable.append(table);
	}


	function convertToFloatTo2(item) {
		//
		var NewItem;
		let regPoint = /\./img;
		let regComma = /\,/img;
		let regAmPm = /[:]/img;
		let intItem="";
		if (regAmPm.test(item)) { //'date'
			return item;
			//	console.log('date',NewItem);	
		} else {
            if( regPoint.test(item) ){
				return convertTo(item);

			}else if( regComma.test(item) ){
				intItem = item.replace(",", ".");
				return convertTo(intItem);
			}else{
					
							return item;	
						

			}

			function convertTo(intItem){
				intItem = parseFloat(intItem);
				intItem = intItem + "";
					preNewItem = intItem.split('.');
					preNewItem0 = preNewItem[0];
					preNewItem1 = preNewItem[1] + '';
					preNewItem1 = preNewItem1.slice(0, 2);
					newItem = preNewItem0 + '.';
					newItem = newItem + preNewItem1;
					//console.log("convert"+intItem);
					return newItem;
			}
			//


		}
	
	}



	$('#btnCreateOperation').bind('click', CreateOperation);
	function CreateOperation(){
		let tableName = document.getElementById('newRecipeType').value;
		let name = document.getElementById('newRecipeName').value;
		// console.log(tableName);
		PostHTML(tableName);
		$.ajax({
			url: "http://" + hostName + '/api/Operations/CreateOperation/'+tableName+'/'+name+'/IZO0210',
			type: 'POST',
			contentType:'application/json',
			data: '{"Operation":{"rSetTime":{"Value":"3"},"Ramp_wTimeRampWork":{"Value":"1"}}}',
			success: function(){
				console.log(tableName+' '+name+' is created')},
			error: function(xhr, textStatus, errorThrown){
				console.log(xhr)
				console.log(textStatus)
				console.log(errorThrown)
				console.log(JSON.stringify( NewOperation() ))

				return;
			}

		});
	}
function NewOperation(){
	// console.log(document.querySelectorAll('#divCreateOperation input')[0]);
	var object={};
	document.querySelectorAll('#divCreateOperation input').forEach(function(item){
		object[item.id] = {'Value':item.value};
		// console.log(object);
	})
	operation = {'Operation': object };
	// console.log(operation);
return { 'Operation': object };
}
function PostHTML(tableName){
	let src;
	let html;
	let divForCreateOperation = document.getElementById('divForCreateOperation');
	switch(tableName){
		case 'Layer': 
		{
			src = "Layer";
			break;
		}
		case 'Heating': 
		{
			src = "Heating";
			break;
		}
		case 'Cleaning': 
		{
			src = "Cleaning";
			break;
		}
		default: 
		{
			src = "Material";
			break;
		}
	}
	html = '<object type="text/html" data="D:/Work/6_Services/Data/CreateOperation/'+src+'.html"></object>';
		divForCreateOperation.innerHTML = html;

}


function ifPressure(dataForCheck,item){
	let regPressure=/(Pressure)/img;
	let IfPressure=item.test(regPressure);

	if (IfPressure){
	//console.log("Соответствие"+item);
		if (dataForCheck[item]!=null){
			return varPressure=convertToFloatTo4(dataForCheck[item]);
		}
		else{
			return 0;
		}

		
	}else{
		return item;
	}

}

function unPuckButton(item,placeButton, countBit){
	let dataMode = parseInt(item);
	let modeBits = unPack(dataMode);
for (var i=0;i<=countBit;i++){
		if (modeBits[i] == "1") {
		$("#" + placeButton + i).addClass("active");
	}
}

}

function SizeFor_load_process(){


		let HeightFor_load_process=$("[id=for_load_process").height();
		let HeightDiv70Container=$(" .div70.container").height();
		if (HeightFor_load_process>HeightDiv70Container){
			// console.log(HeightDiv70Container);

			$("#for_load_process>div").height(HeightDiv70Container);
			let styleGetHTML= "overflow-y:scroll;height:"+(HeightDiv70Container-10)+"px";
			document.querySelector("#for_load_process>div").setAttribute("style", styleGetHTML);
			
		
		}
			
			
}
function createItemCheckBox(data){
	if (document.getElementById("items")){
		document.getElementById("items").innerHTML="";
	}
	
	let i=0;
	dataForSave={};

	
data.map(function(element){
	dataForSave[element]="true";
	let input=document.createElement('input');
	input.type="checkbox";
	input.name="ReportItem";
	input.id="checkbox_"+element;
	input.checked=true;
	let label=document.createElement('label');
	label.textContent=element;
	if (i%4==0){
		let div=document.createElement('div');
		div.className="col-3";
		$("#items").append(div);
		div.append(input);
		div.append(label);
		div.append(document.createElement('br'));
	}else{
		$("#items div:last-of-type").append(input);
		$("#items div:last-of-type").append(label);
		$("#items div:last-of-type").append("<br>");
	}
	
/*	label.setAttribute("style","padding-right:12px");*/
	i++;
	if (i==24){
		i=0;
	}
	if (input.checked){
		$("."+element).css("display","table-cell");
	}else{
		$("."+element).css("display","none");
	}
	input.addEventListener('change', function (target) {
		let id=target.currentTarget.id.slice(9,);
	// console.log(input.checked);
	if (input.checked){
		$("."+id).css("display","table-cell");
		dataForSave[id]="true";
	}else{
		$("."+id).css("display","none");
		dataForSave[element]="false";
	}
	dataJSON=JSON.stringify(dataForSave)+"";
	$.ajax({
		url: '/Data/ItemsForView/write.php',
		type: 'Post',
	
		data:{name:$('#CurrentEquipment').text().toLocaleLowerCase(),items:dataJSON},
		success: function () {
			console.log("Good job!")
		},
		error: function (xhr, textStatus, errorThrown) {
			console.log(xhr)
			console.log(textStatus)
			console.log(errorThrown)
			return;
		}
	});

/*	elementCheckBox.setAttribute("style","display:none");*/


	//input.checked(alert("1"))
});


	
	//input.checked(alert("1"))
});
equipmentSmallCapsName=$('#CurrentEquipment').text().toLocaleLowerCase();
	
	var oReq = new XMLHttpRequest();
	oReq.open("get", "/Data/ItemsForView/"+equipmentSmallCapsName+".txt", true);
	oReq.send();
	oReq.onreadystatechange= function (){
		console.log(oReq.status);
		if (oReq.status=="200"){
		  oReq.onload = function(){
			  dataForReportRow=JSON.parse(this.responseText);
			 Object.keys(dataForReportRow).forEach(function(key){
				if (dataForReportRow[key]=="true"){
					$("."+key).css("display","table-cell");
					$("#checkbox_"+key).prop("checked",true);
					console.log($("#checkbox_"+key));
				}else{
					$("."+key).css("display","none");
					$("#checkbox_"+key).prop("checked",false);
				}
				  console.log(key+":"+dataForReportRow[key]);
			  })
		  
		  
		  };
		}else{
		  
		  return;
		}
	}

}

function LoadAppropriateEquipment(name){

	function reqListener () {
		
		$("#divForAppropriateEquipment").text("");
		$("#divForAppropriateEquipment").append(this.responseText);
	  }
	  
	  var oReq = new XMLHttpRequest();
	  oReq.open("get", "/Data/StatusLine/"+name+"_statusLine.txt", true);
	  oReq.send();
	  oReq.onreadystatechange= function (){
		if (oReq.status=="200"){
			return;
		}else{
			oReq.open("get", "/Data/StatusLine/_statusLine.txt", true);
			oReq.send();
		  
		}
		oReq.onload = reqListener;
	}
}

function UploadProcessRreportRowDataTemplate(name){
/*
	let script = document.createElement("script");
	script.type = "text/javascript";
	try{
	script.src = "/Data/ProcessRreportRowDataTemplate/"+name+"_items.js";

	
	}
	catch(event){

	}
	if ($("#DataProcess").text().length<3){
		script.src = "/Data/_items.js";
	}
	$("head").append(script);
*/
	String1 = $("#DataProcess").text().split(",");
	String2 = $("#DataReport").text().split(",");
}


function WafeForm(number,name){
	$("#"+name).val("")
	switch(number){
		case "0":
		$("#"+name).css({"background-image":"url('Pictures/синус.bmp')"})
		break;
		case "1":
		$("#"+name).css({"background-image":"url('Pictures/брови.bmp')"})
		break;
		case "2":
		$("#"+name).css({"background-image":"url('Pictures/ступеньки.bmp')", "background-size":"40%"})
		break;
		case "3":
		$("#"+name).css({"background-image":"url('Pictures/пила.bmp')", "background-size":"50%"})
		break;
		default:
		$("#"+name).css({"background-image":"url('Pictures/пустой.bmp')"})
		break;
	}
}
function SweepMode(number,name){
	switch(number){
		case "2":
		$("#"+name).val("Lissajous")
		break;
		case "3":
		$("#"+name).val("Matrix")
		break;
		case "4":
		$("#"+name).val("Circle/Spiral")
		break;
		default:
			$("#"+name).val("Off")
		break;
	}
}


});