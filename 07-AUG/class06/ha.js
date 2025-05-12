function changeColor(){
    if (document.getElementById('txt1').checked == true) {
        document.getElementById('myTable').style.backgroundColor = 'red';
    }
    else if (document.getElementById('txt2').checked == true) {
        document.getElementById('myTable').style.backgroundColor = 'blue';
    }
    else if (document.getElementById('txt3').checked == true) {
        document.getElementById('myTable').style.backgroundColor = 'green';
    }
    else if (document.getElementById('txt4').checked == true) {
        document.getElementById('myTable').style.backgroundColor = 'yellow';
    }
    else {
        document.getElementById('myTable').style.backgroundColor = 'gray';
    }
}

