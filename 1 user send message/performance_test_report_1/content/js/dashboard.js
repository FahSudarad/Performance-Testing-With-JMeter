/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/api/auth/logout/68777986418a81e9470d3812-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/68777991418a81e9470d3813-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/6877797e418a81e9470d3811-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/687779b0418a81e9470d3816-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/687779c0418a81e9470d3818-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/68774ca4418a81e9470d380c-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/687779a5418a81e9470d3815-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/login-102"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/login-103"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/6877799b418a81e9470d3814-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/687779b0418a81e9470d3816-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/68774ca4418a81e9470d380c-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/687779b9418a81e9470d3817-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/687747236c5104d056b3bae2-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/687779c0418a81e9470d3818-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/68777991418a81e9470d3813-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/messages/getmsg-110"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/6877797e418a81e9470d3811-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/messages/getmsg-111"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/68777986418a81e9470d3812-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/allusers/687779b9418a81e9470d3817-105"], "isController": false}, {"data": [1.0, 500, 1500, "/api/messages/addmsg-117"], "isController": false}, {"data": [1.0, 500, 1500, "/api/messages/addmsg-116"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/687779a5418a81e9470d3815-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/687747236c5104d056b3bae2-119"], "isController": false}, {"data": [1.0, 500, 1500, "/api/auth/logout/6877799b418a81e9470d3814-119"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 80, 0, 0.0, 10.475000000000001, 1, 84, 3.5, 51.0, 52.0, 84.0, 5.3543939495348365, 67.3300659678067, 2.299539647613948], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/auth/logout/68777986418a81e9470d3812-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/logout/68777991418a81e9470d3813-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/logout/6877797e418a81e9470d3811-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/logout/687779b0418a81e9470d3816-119", 1, 0, 0.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 172.8515625, 382.8125], "isController": false}, {"data": ["/api/auth/logout/687779c0418a81e9470d3818-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/logout/68774ca4418a81e9470d380c-119", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 57.6171875, 127.60416666666666], "isController": false}, {"data": ["/api/auth/allusers/687779a5418a81e9470d3815-105", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 11412.109375, 46.2646484375], "isController": false}, {"data": ["/api/auth/login-102", 10, 0, 0.0, 3.5, 1, 11, 3.0, 10.300000000000002, 11.0, 11.0, 11.876484560570072, 3.815784590261283, 4.9060087589073635], "isController": false}, {"data": ["/api/auth/login-103", 10, 0, 0.0, 56.3, 51, 84, 52.0, 82.10000000000001, 84.0, 84.0, 11.350737797956867, 84.86671750851305, 5.111157420544836], "isController": false}, {"data": ["/api/auth/allusers/6877799b418a81e9470d3814-105", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 11412.109375, 46.2646484375], "isController": false}, {"data": ["/api/auth/allusers/687779b0418a81e9470d3816-105", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 18259.375, 74.0234375], "isController": false}, {"data": ["/api/auth/allusers/68774ca4418a81e9470d380c-105", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 13042.410714285714, 52.87388392857143], "isController": false}, {"data": ["/api/auth/logout/687779b9418a81e9470d3817-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/allusers/687747236c5104d056b3bae2-105", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 10144.097222222223, 41.12413194444445], "isController": false}, {"data": ["/api/auth/allusers/687779c0418a81e9470d3818-105", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 30431.640625, 123.37239583333333], "isController": false}, {"data": ["/api/auth/allusers/68777991418a81e9470d3813-105", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 11412.109375, 46.2646484375], "isController": false}, {"data": ["/api/messages/getmsg-110", 10, 0, 0.0, 2.0, 1, 3, 2.0, 2.9000000000000004, 3.0, 3.0, 13.03780964797914, 4.188905638852673, 5.4493970013037805], "isController": false}, {"data": ["/api/auth/allusers/6877797e418a81e9470d3811-105", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 11412.109375, 46.2646484375], "isController": false}, {"data": ["/api/messages/getmsg-111", 10, 0, 0.0, 5.5, 4, 8, 5.0, 7.9, 8.0, 8.0, 13.03780964797914, 5.095440840938722, 6.060544328552803], "isController": false}, {"data": ["/api/auth/allusers/68777986418a81e9470d3812-105", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 10144.097222222223, 41.12413194444445], "isController": false}, {"data": ["/api/auth/allusers/687779b9418a81e9470d3817-105", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 30432.291666666664, 123.37239583333333], "isController": false}, {"data": ["/api/messages/addmsg-117", 10, 0, 0.0, 5.6000000000000005, 4, 8, 5.0, 8.0, 8.0, 8.0, 13.089005235602095, 3.8857984293193715, 6.788643242801047], "isController": false}, {"data": ["/api/messages/addmsg-116", 10, 0, 0.0, 2.0000000000000004, 1, 3, 2.0, 3.0, 3.0, 3.0, 13.140604467805518, 4.221932490144547, 5.492362023653088], "isController": false}, {"data": ["/api/auth/logout/687779a5418a81e9470d3815-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}, {"data": ["/api/auth/logout/687747236c5104d056b3bae2-119", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 57.6171875, 127.60416666666666], "isController": false}, {"data": ["/api/auth/logout/6877799b418a81e9470d3814-119", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 86.42578125, 191.40625], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 80, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
