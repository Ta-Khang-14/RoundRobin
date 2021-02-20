let startBtn = document.querySelector('.startBtn');
let resetBtn = document.querySelector('.reset');
let inputData = document.querySelector('.input-data');
let ganttBox = document.querySelector('.gantt-box');
let waitingTimeElement = document.querySelector('.waittingTime');
let processTimeElement = document.querySelector('.processTime');
// chạy sau khi đã nhận được dữ liệu đầu vào
let clickRun = function() {

    let runBtn = document.querySelector('.input-data .btn'); 
    runBtn.addEventListener('click', function() {
        let varCheck = document.querySelector('.item-process');
        if(varCheck == null) {
            let listWaitingTime = document.querySelectorAll('.input-item input:nth-child(2)');
            let listCPUtime = document.querySelectorAll('.input-item input:nth-child(3)');
            let valid = true;
            for(let i = 0 ; i < listCPUtime.length ; i++) {
                let check = listCPUtime[i].value * listWaitingTime[i].value;
                if(Number.isNaN(check) == true || check < 0) {
                    if(Number.isNaN(listWaitingTime[i].value * 1) == true || listWaitingTime[i].value * 1 < 0) {
                        listWaitingTime[i].classList.add('invalid');
                    }
                    if(Number.isNaN(listCPUtime[i].value * 1) == true || listCPUtime[i].value * 1 < 0) {
                        listCPUtime[i].classList.add('invalid');
                    }
                    valid = false;
                }
            }
            if(valid) {
                console.log('Chạy.....');
                let processings = [];
                let array = [];
                for(let i = 0 ; i < listCPUtime.length ; i++) {
                    listCPUtime[i].classList.remove('invalid');
                    listWaitingTime[i].classList.remove('invalid');
                    processings.push([`P${i+1}`,listWaitingTime[i].value * 1,listCPUtime[i].value * 1]);
                    array.push([`P${i+1}`,listWaitingTime[i].value * 1,listCPUtime[i].value * 1]);
                }
                // let processings = [
                //     ['P1',0,11],
                //     ['P2',3,7],
                //     ['P3',8,19],
                //     ['P4',13,4],
                //     ['P5',17,9]
                // ]
                let start = ['Start',0];
                // let array = [
                //     ['P1',0,11],
                //     ['P2',3,7],
                //     ['P3',8,19],
                //     ['P4',13,4],
                //     ['P5',17,9]
                // ]
                // sap xep theo thu tu tang dan cua thoi gian xuat hien
                processings.sort(function(array1, array2){
                    if(array1[1] == array2[1]){
                        return array1[2] - array2[2];
                    }
                    return array1[1] - array2[1];
                });
                array.sort(function(array1, array2){
                    if(array1[1] == array2[1]){
                        return array1[2] - array2[2];
                    }
                    return array1[1] - array2[1];
                });
                let store = [];
                let process = [];
                let quantum = document.querySelector('#quantum').value * 1;
                let countTime = processings[0][1];
                
                // thuật toán round robin
                let roundRobin = function(){
                    if(processings[0][2] > quantum){
                        process.push([processings[0][0],quantum]);
                        processings[0][2] -= quantum;
                        countTime += quantum;
                        let check = true;
                        for(let i = 1 ; i < processings.length ; i++){
                            if(processings[i][1] < countTime){
                                store.push(processings[i]);
                                processings.splice(i,1);
                                i--;
                            }
                            else if(processings[i][1] == countTime) {
                                if(!(processings[0] in store)){
                                    store.push(processings[0]);
                                }
                                store.push(processings[i]);
                                processings.splice(i,1);
                                i--;
                                check = false;
                            }
                        }
                        if(check) {
                            store.push(processings[0]);
                        }
                        processings.shift();
                        
                    }
                    else {
                        countTime+=processings[0][2];
                        process.push([processings[0][0],processings[0][2]]);      
                        processings.shift();
                        let exist = true;
                        processings.forEach(function(value){
                            if(value[1] <= countTime){
                                store.push(value);
                                processings.shift();
                                exist = false;
                            }
                        })
                        if(exist == true && processings[0][1] > countTime){
                            process.push(['None',processings[0][1]]);
                            countTime += (processings[0][1] - countTime);
                            store.push(processings[0]);
                            processings.shift();
                        }
                    }
                    while(processings.length !== 0 || store.length !== 0){
                        if(store[0][2] > quantum){
                            countTime += quantum;
                            process.push([store[0][0],countTime]);
                            store[0][2] -= quantum;
                            if(store[0][2] === 0){
                                store.shift();
                                if(processings.length !== 0){
                                    for(let i = 0 ; i < processings.length ; i++){
                                        if(processings[i][1] <= countTime){
                                            store.push(processings[i]);
                                            processings.splice(i,1);
                                            i--;
                                        }
                                    }
                                }
                                else continue;
                            }
                            if(processings.length !== 0){
                                let check = true;
                                for(let i = 0 ; i < processings.length ; i++){
                                    if(processings[i][1] < countTime){
                                        store.push(processings[i]);
                                        store.push(store[0]);
                                        processings.splice(i,1);
                                        i--;
                                        check = false;
                                    }
                                    else if(processings[i][1] == countTime){
                                        if(store[store.length-1] != store[0] || store.length == 1){
                                            store.push(store[0]);
                                        }
                                        store.push(processings[i]);
                                        processings.splice(i,1);
                                        i--;
                                        check = false;
                                    }
                                }
                                if(check){
                                    store.push(store[0]);
                                }
                                store.shift();
                            }
                            else if(processings.length === 0){
                                store.push(store[0]);
                                store.shift();
                            }
                        }
                        else {
                            countTime += store[0][2];
                            process.push([store[0][0],countTime]);
                            store.shift();
                            if(processings.length != 0){
                                for(let i = 0 ; i < processings.length ; i++){
                                    if(processings[i][1] <= countTime){
                                        store.push(processings[i]);
                                        processings.splice(i,1);
                                        i--;
                                    }
                                }
                            }
                           if(store.length == 0 && processings.length != 0 && processings[0][1] > countTime){
                                process.push(['None',processings[0][1]]);
                                store.push(processings[0]);
                                countTime = processings[0][1];
                                processings.shift();
                            }  
                        }
                
                    }
                    process.unshift(start);
                }
                
                roundRobin();
                // đếm thời gian chờ từng tiến trình
                let countWaitingTime = function() {
                    for(let i = 0 ; i < array.length ; i++) {
                        let waitingTime = 0;
                        let check = true;
                        let temp = 0;
                        for(let j = 1 ; j < process.length ; j++) {
                            if(process[j][0] == array[i][0]) {
                                if(check) {
                                    waitingTime += (process[j-1][1] - array[i][1]);
                                    check = false;
                                    temp = process[j][1];
                                }
                                else {
                                    waitingTime += (process[j-1][1] - temp);
                                    temp = process[j][1];
                                }
                                
                            }
                        }
                        array[i].push(waitingTime);
                    }
                }
                countWaitingTime();
                // đếm thời gian xử lý từng tiến trình
                let countProcessTime = function() {
                    for(let i = 0 ; i < array.length ; i++){
                        array[i].push(array[i][2] + array[i][3]);
                    }
                }
                countProcessTime();
                ganttBox.style.minWidth = `${(process.length+1) * 50}px`;
                for(let i = 0 ; i < process.length ; i++){
                    let processItem = document.createElement('div');
                    ganttBox.appendChild(processItem);
                    processItem.classList.add('item-process');
                    processItem.innerText = process[i][0];
                    let timeLine = document.createElement('span');
                    processItem.appendChild(timeLine);
                    timeLine.innerText = `${process[i][1]}`;         
                }
                for(let i = 0 ; i < array.length ; i++){
                    let waitingTimeLine = document.createElement('div');
                    waitingTimeElement.appendChild(waitingTimeLine);
                    waitingTimeLine.innerText = `Thời gian chờ của ${array[i][0]}: ${array[i][3]}`;
                    let processTimeLine = document.createElement('div');
                    processTimeElement.appendChild(processTimeLine);
                    processTimeLine.innerText = `Thời gian chờ của ${array[i][0]}: ${array[i][4]}`;
                }

            }
        }
    })
}
// kiểm tra điều kiện số tiến trình nhận vào khi click và tạo table
let clickStart = function() {
    startBtn.addEventListener('click', function() {
        let varCheck = document.querySelector('.input-item');
        if(varCheck == null) {
            let checkTotal = document.getElementById('process').value * document.getElementById('quantum').value;
            let totalProcess = document.getElementById('process').value;
            if(Number.isNaN(checkTotal*1) == true || checkTotal*1 <= 0){
                document.getElementById('process').classList.add('invalid');
                document.getElementById('quantum').classList.add('invalid');
            }
            else{
                document.getElementById('process').classList.remove('invalid');
                document.getElementById('quantum').classList.remove('invalid');
                for(let i = 0 ; i < totalProcess ; i++){
                let inputItem = document.createElement('div');
                inputData.appendChild(inputItem);
                inputItem.classList.add('input-item');
                let childDiv = document.createElement('div');
                childDiv.innerText = `P${i+1}`;
                inputItem.appendChild(childDiv);
                let inputChild = document.createElement('input');
                inputChild.classList.add('watingTime');
                let inputChild2 = document.createElement('input');
                inputChild2.classList.add('cpuTime');
                inputItem.appendChild(inputChild);
                inputItem.appendChild(inputChild2);
                }
                let runBtn = document.createElement('div')
                runBtn.innerText = 'Chạy';
                runBtn.classList.add('btn');
                inputData.appendChild(runBtn);
                clickRun();
            }
        }
    })
}
clickStart();

// xóa các table và gantt khi click reset
let clickReset = function() {
    resetBtn.addEventListener('click', function() {
        let listItem = document.querySelectorAll('.input-item');
        for(let i = 0 ; i < listItem.length ; i++) {
            inputData.removeChild(listItem[i]);
        }
        let runBtn = document.querySelector('.input-data .btn');
        inputData.removeChild(runBtn);

        let listProcess = document.querySelectorAll('.item-process');
        let listSpan = document.querySelectorAll('.item-process span');
        for(let i = 0 ; i < listProcess.length ; i++) {
            listProcess[i].removeChild(listSpan[i]);
            ganttBox.removeChild(listProcess[i]);
        }

        let listWaitingDiv = document.querySelectorAll('.waittingTime div');
        for(let i = 0 ; i < listWaitingDiv.length ; i++) {
            waitingTimeElement.removeChild(listWaitingDiv[i]);
        }

        let listProcessDiv = document.querySelectorAll('.processTime div');
        for(let i = 0 ; i < listProcessDiv.length ; i++) {
            processTimeElement.removeChild(listProcessDiv[i]);
        }
    })
}
clickReset();



