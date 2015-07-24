function ajax_call(y,m) {
	
	var _postdata = {
		"year" : y,
		"month" : m
	};
	
	$.ajax({
		url: "/_sys/_core/click_n1000/post/inc/calendar_ajax.php",
		type: "post",
		//dataType: "json",
		data: _postdata,
		//contentType: "application/json; charset=utf-8",
		success: function(data) {
			g_cal_val = data;
			for ( var i=1; i<=g_cal_val.length; i++ ) {
				var day_temp = g_cal_val[i-1].field3;
				var day_t = day_temp.substr(6, 2);
				document.getElementById("day_"+day_t).innerHTML = "<span>"+g_cal_val[i-1].field1+"</span>";
				var temp_f3 = g_cal_val[i-1].field3;
				var temp_f1 = g_cal_val[i-1].field1;
				var temp_f4 = g_cal_val[i-1].field4 + " " + g_cal_val[i-1].field5 + " ~ " +  g_cal_val[i-1].field6 + " " +  g_cal_val[i-1].field7;
				var temp_f3_t1 = temp_f3.substr(0,4);
				var temp_f3_t2 = temp_f3.substr(4,2);
				var temp_f3_t3 = temp_f3.substr(6,2);
				var temp_f3_t = temp_f3_t1 + "." + temp_f3_t2 + "." + temp_f3_t3;
				var temp_f5 = temp_f1 + "br 교육일자 : " + temp_f3_t + "br 교육시간 : " + temp_f4;
				$(".calendar-click[value='"+temp_f3+"']").attr("value",temp_f5);
			}
		},
		error: function() {
			alert("일정을 가져오는데 실패하였습니다.\n(error code : AJAX 통신오류)");
		}
	});
}


$(document).ready(function() {
    var Calendar = new Date();
        var now_year = Calendar.getFullYear();
    var now_month = Calendar.getMonth() + 1;
    if (now_month < 10) 
        now_month = "0" + now_month;
    var now_date = Calendar.getDate();
    if (now_date < 10)
    	now_date = "0" + now_date;
    var now_day = Calendar.getDay();
    var now = now_year + now_month + now_date;
    var daysInfo = "";

    var p_year = now_year;
    var p_month = now_month;
    var p_date = now_date;
    var p_day = now_day;

    $("#calendar_yearmonth").text(p_year + "년 " + p_month + "월");

    makeDiary();
	ajax_call(p_year, p_month);

    $("#calendar_preMonth img").click(function(){
        p_month--;
        if (p_month < 1) {
            p_year--;
            p_month = 12;
        }
        if (p_month < 10) {
            p_month = "0" + p_month;
        }
        $("#calendar_yearmonth").text(p_year + "년 " + p_month + "월");
        makeDiary();
		ajax_call(p_year, p_month);
    });

    $("#calendar_nextMonth img").click(function(){

        p_month++;
        if (p_month > 12) {
            p_year++;
            p_month = 1;
        }
        if (p_month < 10) {
            p_month = "0" + p_month;
        }
        $("#calendar_yearmonth").text(p_year + "년 " + p_month + "월");
        makeDiary();
		ajax_call(p_year, p_month);
    });

    function makeDiary() {
        $(".calendar-day tr").remove();
        
        var firstDate = new Date(p_year, (p_month - 1), 1);
        var lastDate = getTotalDate(p_year, p_month);
        var firstDay = firstDate.getDay();
        //var lastday = lastDate.getDate();
        var previousDate = getTotalDate(p_year, p_month-1); // 전달의 총 일수
        var start_previousDate = previousDate - firstDay + 1;
        var appendText = "<tr>";

        for ( var i=0; i < firstDay; i++ ) {
            appendText += "<td><span class='prenextday'>"+start_previousDate+"</span></td>";
			//appendText += "<td><span id='prenextday'></span></td>";
            start_previousDate++;
        }
        
        for (var i=1 ; i<=lastDate ; i++) {
            if ( i < 10 ) 
                var j = "0" + i;
            else
                var j = i;
            
            var dayColor = "";
            if (firstDay == 0) dayColor = "sunday";
            else if (firstDay == 6) dayColor = "saturday";
            else dayColor = "";
            
            if ( (p_year + p_month + j) == now ) 
                appendText += "<td class='calendar-click "+dayColor+" today' value='"+p_year+p_month+j+"'><p>"+i+"</p><span id='day_"+j+"'></span></td>";
            else 
                appendText += "<td class='calendar-click "+dayColor+"' value='"+p_year+p_month+j+"'><p>"+i+"</p><span id='day_"+j+"'></span></td>";
            firstDay++;
            
            if (firstDay > 6) {
                firstDay = 0;
                appendText += "</tr>";
                appendText += "<tr>";
            }
        }
        
        if (firstDay != 0) {
            for (var i=1 ; i<=7-firstDay ; i++) {
                appendText += "<td><span class='prenextday'>"+i+"</span></td>";
            }
        }
        
        $(".calendar-day").append(appendText).trigger("create");
        
        //$(".C1000-td-click[value='"+now+"'").css("background-color", "red");
        
        $(".calendar-click").click(function(){
            $(".calendar-selected").removeClass("calendar-selected");
            $(this).addClass("calendar-selected");
            daysInfo = $(this).attr("value");
			var daysInfo_c = daysInfo.replace(/br/gi,"<br />")
			
            //alert(daysInfo);
			if (daysInfo.length != 8) {
				$("#dialog-message p").empty();
				$("#dialog-message p").append(daysInfo_c);
				$("#dialog-message").dialog({
					modal: true,
					buttons: {
						"확인" : function() {
							$(this).dialog("close");
						}
					}
				});
			}
        });
    }

    function getTotalDate(year, month) {
        if (month==4 || month==6 || month==9 || month==11)
            return 30;
        else if (month==2) {
            if (year%4 == 0) return 29;
            else return 28;
        }
        else return 31;
    }
});