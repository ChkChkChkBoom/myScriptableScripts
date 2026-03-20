//adaptive variables with recalc support
const VERSION = "1.0.0";
class adaptiveVariable {
    constructor(name, equation) {
        this.name = name;
        this.equation = equation;
        this.value=eval(equation);
    }
    access(){
        return eval(this.equation);
    }
    lightAccess(){
        return this.value;
    }
    recalc(){
        this.value=eval(this.equation);
    }
}
module.exports = {
    adaptiveVariable
}