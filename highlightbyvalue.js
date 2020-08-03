
;function highlightByValue(options) {
     "use strict";

   // Default settings and variables, can be overriden by user
    var defaults = {
        tableId :               '',                  //str Required. ID of table
        color:                  '',                  //rgb Highlight color rgb(85, 145, 60)
        direction:              'desc',              //str "desc" will highlight the top (n) values. "asc" the bottom (n)
        numberOfCells:          0,                   //num The number of rows or columns to highlight. 0 for all 
        dataGroupsToHighlight:  [0],                 //arr Specific columns or rows to highlight. Ex: [2,3,4]. [0] will highlight all
        dataGroup:              'columns',           //str "rows" or "columns"
        cssClassName:           '',                  //str CSS class that will be applied after background color and before auto-whiten
        skipFirst:              false,               //bit skip first dataGroup (column or row)
        autoContrastingText:    true,                //bit Will auto-whiten text on dark colors  
        colorGradeMaxLight:     90,                  //num [0 - 90] maximum percentage of lightness to applied to original color (highest or lowest value)
        
        dataAttribute:          null,                //str Name of custom data atribute in your table. "https://www.w3schools.com/tags/att_data-.asp" Highlight based on values on data attribute instead of cell
        showTitleTags:          true,                //bit 
    }
     
    //Declares the settings which should be used by the program
    var settings = Object.assign(defaults, options);//merges options with defaults; 
    var tableObj = document.querySelector("table#" + settings.tableId);
    settings.color = settings.color ? settings.color : (settings.direction == 'asc' ? 'rgb(145, 0, 0)' : 'rgb(85, 145, 60)');//default colors

    // https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#stackoverflow-archive-begin
    const RGB_Log_Shade=(p,c)=>{
        var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:p*255**2,P=P?1+p:1-p;
        return"rgb"+(d?"a(":"(")+r((P*i(a[3]=="a"?a.slice(5):a.slice(4))**2+t)**0.5)+","+r((P*i(b)**2+t)**0.5)+","+r((P*i(c)**2+t)**0.5)+(d?","+d:")");
    }///

    const contrastingTextColor=(rgb)=>{
         var m = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if(m) {
            var yiq = ((m[1]*299)+(m[2]*587)+(m[3]*114))/1000;
            return (yiq >= 128) ? 'black' : 'white';
        }
    }

    
    const parseTable = ()=>{
        var row,
            rows = tableObj.rows;
        var cell, cells;
        var dataGroupArrays = [];
        var label = settings.direction == 'asc' ? 'Lowest' : 'Highest';
        var arrayHeight = settings.dataGroup == 'columns' ? rows[0].cells.length : rows.length;
        var arraywidth = settings.dataGroup == 'columns' ? rows.length : rows[0].cells.length;
       
        //init an array for each dataGroup
        for (var i = 0; i < arrayHeight; i++) {
            dataGroupArrays[i] = [];
        }

       settings.numberOfCells = settings.numberOfCells ? settings.numberOfCells : arraywidth;  //if 0 then highlight the whole table

         
        //add values to each data array for each row (converts to number or ignores)
        for (var i = 0; i < rows.length; i++) {
             if(settings.skipFirst && i === 0 && settings.dataGroup == 'columns'){continue;}
            for (var j = 0; j < rows[i].cells.length; j++) {
                if(settings.skipFirst && j === 0 && settings.dataGroup == 'rows'){continue;}
                var k = settings.dataGroup == 'columns' ? j : i;
                try {
                    if(settings.dataAttribute){
                        var cellValue = rows[i].cells[j].getAttribute(settings.dataAttribute);
                    } else {
                        var cellValue = rows[i].cells[j].innerHTML.replace(/[^0-9\.-]+/g, "");
                    }
                    cellValue = !cellValue ? null : Number(cellValue);
                    dataGroupArrays[k].push(cellValue);
                  
                } catch (err) {
                    dataGroupArrays[k].push(null);
                    console.log(err);
                }
            }
        }


        //sort each column array and limit to top(n) items
        for (var i = 0; i < dataGroupArrays.length; i++) {
            dataGroupArrays[i] = dataGroupArrays[i].filter(function (x) {return x !== null;});//remove nulls before sorting
            dataGroupArrays[i] = [...new Set(dataGroupArrays[i])]; //dedupe before sorting
            dataGroupArrays[i] = settings.direction == 'asc' ? dataGroupArrays[i].sort((a, b) => a - b) : dataGroupArrays[i].sort((b, a) => a - b);
            dataGroupArrays[i] = dataGroupArrays[i].slice(0, settings.numberOfCells);
        }

        //compare cell's value to respective columnArray and highlight matches
        for (var i = 0; i < rows.length; i++) {
            if(settings.skipFirst && i === 0 && settings.dataGroup == 'columns'){continue;}
            for (var j = 0; j < rows[i].cells.length; j++) {
                if(settings.skipFirst && j === 0 && settings.dataGroup == 'rows'){continue;}
                var k = settings.dataGroup == 'columns' ? j : i;
                try {
                    if((settings.dataGroupsToHighlight.length == 1 && settings.dataGroupsToHighlight[0] == 0) || settings.dataGroupsToHighlight.indexOf(k+1) >=0){    
                        var cellValue = settings.dataAttribute ? rows[i].cells[j].getAttribute(settings.dataAttribute) : rows[i].cells[j].innerText.replace(/[^0-9\.-]+/g, ""); //this should return null if NaN
                        cellValue = !cellValue ? NaN : Number(cellValue);
                        var positionFound = dataGroupArrays[k].indexOf(cellValue);
                        var colorGradeIncrement = settings.numberOfCells <= 1 ? 0 : settings.colorGradeMaxLight / (settings.numberOfCells-1);
                        if (positionFound >= 0) {
                            var colorGradePercent = (positionFound*colorGradeIncrement)/100;
                            rows[i].cells[j].style.backgroundColor = RGB_Log_Shade(colorGradePercent,settings.color); //apply graded color
                            if(settings.autoContrastingText){rows[i].cells[j].style.color = contrastingTextColor(RGB_Log_Shade(colorGradePercent,settings.color))}; //auto-whiten text
                            if(settings.showTitleTags){rows[i].cells[j].title = (positionFound > 0) ? cellValue + ' (rank ' + (positionFound+1)+')' : cellValue + ' (' + label + ')'}; //set title tags
                            rows[i].cells[j].classList.add(settings.cssClassName); //apply css class
                        }
                    }
                } catch (err) {console.log(err)}
            }
        }
    }

    if(tableObj){parseTable(tableObj)};
};
