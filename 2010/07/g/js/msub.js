function setColSpan(a, b, c){
    //var rows = table.rows.length;//行数    
    //var cells = table.rows[i].cells.length;//列数   
    
    var rows = document.getElementById('myTable').rows.length;
    var cells = document.getElementById('myTable').rows[0].cells.length;
    
    var dom = document.getElementById('myTable').rows[a].cells;
    dom[b].colSpan = c;
    
    
    if (c + b >= cells || c >= cells || b >= cells || a >= rows || c > cells) 
        return false;
    
    for (var i = b + 1; i < c + b; i++) {
        dom[i].style.display = 'none';
    }
}
