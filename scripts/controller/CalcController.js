class CalcController {

    constructor(){

        // '_underline' quer dizer que o construtor é privado

        this._lastOperator = '';
        this.lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR'
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize(){
    
        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();

        }, 1000);  

        this.setLastNumberToDisplay();

    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{


            switch (e.key) { 
                case 'Escape':
                    this.clearAll();
                break;
    
                case 'Backspace':
                    this.cancelEntry();
                break;
    
                case '+':
                case '-':
                case '*':
                case '/':  
                case '%':          
                    this.addOperation(e.key);
                break;

                case '.':
                case ',':    
                    this.addDot();
                break;
    
                case 'Enter':
                case '=':   
                    this.calc();
                break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            
            }
        }

       );

    }

    addEventListenerAll(elements, events, fn){ //Metodo para tratar multiplos events (element-btn, events-click and drag, fn-function)
        events.split(' ').forEach(event => {  //SPLIT() transforma Strings em Arrays
            elements.addEventListener(event, fn, false);
        });

    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){

        return (['+', '-', '*', '/','%'].indexOf(value) > -1);
    }

    pushOperation(value){ //Metodo PUSH add mais uma informação no array
        this._operation.push(value);

        if (this._operation.length > 3){

            this.calc();
        }
          
    }

    getResult(){

        return eval (this._operation.join("")); //Metodo EVAL executa operação
    }

    calc(){ 

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if (this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }

        else if (this._operation.length == 3){

            this._lastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if (last == '%'){
            result /= 100; //Result é igual a ele mesmo dividido por 100

            this._operation = [result];
        }
        else {
            this._operation = [result];

            if (last) this._operation.push(last);
        
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){  

                if (this.isOperator(this._operation[i]) == isOperator ) {
                    lastItem = this._operation[i];
                    break;
                }

        }

        if (!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }
        
        return lastItem;

    }

    setLastNumberToDisplay(){ //atualizar display

        let lastNumber = this.getLastItem(false);

         if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){

        
       if (isNaN(this.getLastOperation())) { //Avaliar se ultimo botão for uma String 

            if (this.isOperator(value)) { //trocar o operador
               
                this.setLastOperation(value);

            } 
            
            else {

                this.pushOperation(value); 

                this.setLastNumberToDisplay();

            }

       } else {

            if(this.isOperator(value)) {
                this.pushOperation(value);
            }
            else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
           
       }

       
       
    }

    setError(){
        this.displayCalc = "Error";
    }

    cancelEntry(){
        this._operation.pop(); //Metodo POP exclui a ultima informação do Array.

        this.setLastNumberToDisplay();
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation ==='string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }
        else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

    }

    execBtn(value){

        switch (value) { 
            case 'ac':
                this.clearAll();
            break;

            case 'ce':
                this.cancelEntry();
            break;

            case 'soma':
                this.addOperation('+');
            break;

            case 'subtracao':
                this.addOperation('-');
            break;

            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'divisao':
                this.addOperation('/');
            break;

            case 'porcento':
                this.addOperation('%');
            break;

            case 'ponto':
                this.addDot();
            break;

            case 'igual':
                this.calc();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
        
            default:
               this.setError(); 
                break;
        }
    }

    initButtonsEvents(){ //Metodo para tratar multiplos events (selecionar todos os btn da calc feita em SVG)
       let buttons = document.querySelectorAll("#buttons > g, #parts > g");

       buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e =>{ //Event Click and Drag. Btn da calc
                let textBtn = btn.className.baseVal.replace("btn-", ""); //REPLACE substitui uma String para outra.
                this.execBtn(textBtn);
        
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{ //style no cursor do mouse
                btn.style.cursor = "pointer"
            });

        });

    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day:"2-digit", month:"short", year:"numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    } 

    set currentDate(valor){
        this._currentDate = valor;
    }
}