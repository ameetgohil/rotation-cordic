const f2f = require('fixed2float');
const {stack, plot, Plot} = require('nodeplotlib');//import {plot, Plot } from 'nodeplotlib';
const _ = require('lodash');
const repl = require('repl');
let mn = [1, 15];
let atan_rom = (i, m, n) => {
    return f2f.toFixed(Math.atan(Math.pow(2,-i))/(Math.PI),m,n);
};

let iters = 15;
let atan_data = _.range(16).map((i) => atan_rom(i,...mn));

let algo = (x, y, theta, iters) => {
    let xcurr = x;
    let ycurr = y;;
    if(theta > f2f.toFixed(0.5, ...mn)) {
        xcurr = -y;
        ycurr = x;
        theta = theta - f2f.toFixed(0.5, ...mn);
    } else if(theta < f2f.toFixed(-0.5, ...mn)) {
        xcurr = -x
        ycurr = -y;
        theta = theta + f2f.toFixed(1.0, ...mn);
    } else if(theta < f2f.toFixed(0, ...mn)) {
        xcurr = y;
        ycurr = -x;
        theta = theta + f2f.toFixed(0.5, ...mn);
    }
    x = xcurr;
    y = ycurr;
    for(let i of _.range(iters)) {
        xcurr = x;
        ycurr = y;
        let di = theta < 0 ? -1:1;
        x = xcurr - di*(ycurr >> i);
        y = ycurr + di*(xcurr >> i);
        theta = theta - di*atan_rom(i, ...mn);
    }
    return [x,y,theta];
};

let scale = _.range(iters).map(i => Math.sqrt(1 + Math.pow(2, -2*i))).reduce((x,y) => x*y);
console.log(1/scale);
let num = 1000;
let theta = _.range(num).map(i => f2f.toFixed((2*i/(num) - 1), ...mn));
//const data = [{x: [1, 3, 4, 5], y: [3, 12, 1, 4], type: 'line'}];
//let data = [{x: _.range(16), y: atan_data, type: 'line'}];
//let data = [{x: _.range(num), y: theta, type: 'line'}];
let algodata = theta.map(i => algo(0xFF,0,i,iters));
console.log(algodata);

let xinit = f2f.toFixed(1,...mn);
let yinit = 0x0;
xcalc = theta.map(i => algo(xinit,yinit, i, iters)[0]/scale);
ycalc = theta.map(i => algo(xinit,yinit, i, iters)[1]/scale);
let xdata = [{x: theta, y: xcalc, name: 'x', type: 'line'}];
let ydata = [{x: theta, y: ycalc, name: 'y', type: 'line'}];
let tdata = [{x: _.range(num), y: theta.map(i => algo(xinit,yinit, i, iters)[2]/scale), type: 'line'}];


xact = theta.map(i => f2f.toFixed(Math.cos(f2f.toFloat(i, ...mn)*Math.PI), ...mn));
xerror = xact.map((val, i) => Math.abs(val - xcalc[i])*100/f2f.toFixed(1,...mn));
let error = [{x: theta, y: xerror, type: 'line'}];

console.log(f2f.toFixed(1,...mn));

stack(xdata);
stack(ydata);
stack(error);
plot();
//plot([xdata, ydata]);
//plot(ydata);
//plot(tdata);


