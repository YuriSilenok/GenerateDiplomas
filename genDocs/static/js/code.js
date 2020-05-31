function load_img(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var canvas = document.getElementById('img'),
            context = canvas.getContext('2d'),
            img = new Image();
            img.onload = function(){
                canvas.width = document.getElementById('content').clientWidth - 35;
                	canvas.height = img.height * canvas.width / img.width;
                context.drawImage(img,0,0, canvas.width, canvas.height);
                canvas.style.display = "block"
            }
            img.src = e.target.result;
        }
        reader.onerror = function(ex) {console.log(ex);};
        reader.readAsDataURL(input.files[0]);
    }
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('file_img').addEventListener("change", function(){load_img(this);},false);
});
var data_table = null
function load_table(input){
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            data_table = e.target.result
            var workbook = XLSX.read(data_table,{type: 'binary'});
            var sheetsDIV = document.getElementById('sheets');
            sheetsDIV.innerHTML = 'Листы';
            workbook.SheetNames.forEach(function(sheetName) {
                var sheetINPUT = document.createElement('input');
                sheetINPUT.setAttribute('name','sheet');
                sheetINPUT.setAttribute('type','radio');
                var sheetDIV = document.createElement('div');
                sheetDIV.append(sheetINPUT);
                sheetDIV.innerHTML = sheetDIV.innerHTML + sheetName;
                sheetsDIV.append(sheetDIV);
            })
            sheetsDIV.addEventListener("change",function(){
                var sheetsDIV = document.evaluate('./div',document.getElementById('sheets'), null,XPathResult.ANY_TYPE,null),
                sheetDIV = sheetsDIV.iterateNext();
                while(sheetDIV){
                    if(sheetDIV.childNodes[0].checked == true){
                        var sheetName = sheetDIV.childNodes[1].textContent,
                        workbook = XLSX.read(data_table,{type: 'binary'}),
                        sheet = workbook.Sheets[sheetName],
                        header = [],
                        col = 0,
                        cell = sheet[String.fromCharCode(65+col)+1];
                        while(cell){
                            header.push(cell['v']);
                            col ++;
                            cell = sheet[String.fromCharCode(65+col)+1];
                        }
                        var columnsDIV = document.getElementById('columns');
                        columnsDIV.innerHTML = 'Столбцы';
                        header.forEach(function(columnName){
                            var columnINPUT = document.createElement('input');
                            columnINPUT.setAttribute('name','column');
                            columnINPUT.setAttribute('type','checkbox');
                            var columnDIV = document.createElement('div');
                            columnDIV.append(columnINPUT);
                            columnDIV.innerHTML = columnDIV.innerHTML + columnName;
                            columnsDIV.append(columnDIV);
                        });
                        break;
                    }
                    sheetDIV = sheetsDIV.iterateNext();
                }
            });
        }
        reader.onerror = function(ex) {console.log(ex);};
        reader.readAsBinaryString(input.files[0]);
    }  
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('file_table').addEventListener("change", function(){load_table(this);},false);
});