// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
//adaptive variables with recalc support
const VERSION = "1.1.0";
class adaptiveVariable {
    #name;#equation;#value;#getName;
    constructor(name, equation) {
        this.#name = name;
        this.#equation = equation;
        this.#value=eval(equation);
    }
    access(){
        return eval(this.#equation);
    }
    lightAccess(){
        return this.#value;
    }
    recalc(){
        this.#value=eval(this.#equation);
    }
    changeEquation(newEquation){
        this.#equation = newEquation;
        this.recalc();
    }
    jankyNewEquation(newEquation){
        this.#equation = newEquation;
    }
}
class adaptiveVariableManager {
    #variables;
    constructor(){
        this.#variables = {};
    }
    createVariable(name, equation){
        if(this.#variables[name]){
            log(`Variable with name ${name} already exists. Overwriting...`);
            this.#variables[name].changeEquation(equation);
            return;
        }
        this.#variables[name] = new adaptiveVariable(name, equation);
    }
    cVar(name, equation){
        this.createVariable(name, equation);
    }
    getVariable(name){
        if(!this.#variables[name]){
            log(`Variable with name ${name} does not exist.`);
            return null;
        }
        else{
            return this.#variables[name].access();
        }
    }
    gVar(name){
        return this.getVariable(name);
    }
    getVariableLight(name){
        if(!this.#variables[name]){
            log(`Variable with name ${name} does not exist.`);
            return null;
        }
        else{
            return this.#variables[name].lightAccess();
        }
    }
    gVarL(name){
        return this.getVariableLight(name);
    }
    recalcVariable(name){
        if(!this.#variables[name]){
            log(`Variable with name ${name} does not exist.`);
            return;
        }
        else{
            this.#variables[name].recalc();
        }
    }
    rVar(name){
        this.recalcVariable(name);
    }
    changeVariableEquation(name, newEquation){
        if(!this.#variables[name]){
            log(`Variable with name ${name} does not exist.`);
            return;
        }
        else{
            this.#variables[name].changeEquation(newEquation);
        }
    }
    cVEq(name, newEquation){
        this.changeVariableEquation(name, newEquation);
    }
    jankyChangeVariableEquation(name, newEquation){
        if(!this.#variables[name]){
            log(`Variable with name ${name} does not exist.`);
            return;
        }
        else{
            this.#variables[name].jankyNewEquation(newEquation);
        }
    }
    jankyCVEq(name, newEquation){
        this.jankyChangeVariableEquation(name, newEquation);
    }
}
module.exports = {
    adaptiveVariable,adaptiveVariableManager
}