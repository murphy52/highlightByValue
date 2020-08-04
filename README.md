# highlightByValue

Higlights all or specific highest and lowest values in table columns or rows.

ExampleS

1. Here is an example with every setting defined
```
 highlightByValue({
        tableId :               'myTable',           //str REQUIRED. ID of table
        color:                  'rgb(0,145,0)',      //rgb Highlight color. Ex: 'rgb(85, 145, 60)'. Defaults are green for desc and red for asc
        direction:              'desc',              //str "desc" will highlight the top (n) values. "asc" the bottom (n)
        numberOfCells:          3,                   //num The number of rows or columns to highlight. 0 for all 
        dataGroupsToHighlight:  [2,3,4],             //arr Specific columns or rows to highlight. Ex: [2,3,4]. [0] will highlight all
        dataGroup:              'columns',           //str "rows" or "columns"
        cssClassName:           'highlight',         //str CSS class that will be applied after background color and before auto-whiten
        skipFirst:              false,               //bit skip first dataGroup (column or row)
        
        autoContrastingText:    true,                //bit Will auto-whiten text on dark colors  
        colorGradeMaxLight:     0,                   //num [1 - 90] maximum percentage of lightness to applied to original color (highest or lowest value). 0 will auto-grade
        ignoreZero:             false,               //bit Ignores any cells that equal 0                       
        dataAttribute:          null,                //str Name of custom data atribute in your table. "https://www.w3schools.com/tags/att_data-.asp" Highlight based on values on data attribute instead of cell
        showTitleTags:          true,                //bit
        blendColor:             false                //bit Belnds new color with existing color of cell. This will also concat new title tag to existing
    }
 ```   
2. You can define just the tableId and every column will be highlighted
```
   highlightByValue({tableId: 'myTable'})
```   
3. The default settings are defined in the comments at the top of the .js file. Override only those you want.
