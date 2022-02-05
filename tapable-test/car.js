/**
 * 1.定义一个 Car 方法，在内部 hooks 上新建钩子。
 * 分别是同步钩子 accelerate、brake（ accelerate 接受一个参数）、
 * 异步钩子 calculateRoutes
 * 
 * 2.使用钩子对应的绑定和执行方法
 * 
 * 3.calculateRoutes 使用 tapPromise 可以返回一个 promise 对象
 */

const {
  SyncHook,
  AsyncSeriesHook
} = require('tapable');

class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newspeed']), //加速
      brake: new SyncHook(), //刹车
      calculateRoutes:
        new AsyncSeriesHook(["source", "target", "routesList"]) //计算路径
    }
  }
}


const myCar = new Car();

//绑定同步钩子
myCar.hooks.brake.tap("WarningLampPlugin", () =>
  console.log('--WarningLampPlugin'));

//绑定同步钩子 并传参
myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed =>
  console.log(`--Accelerating to ${newSpeed}`));

//绑定一个异步Promise钩子
myCar.hooks.calculateRoutes.tapPromise("calculateRoutes tapPromise",
  (source, target, routesList, callback) => {
    // return a promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`--tapPromise to ${source} ${target} ${routesList}`)
        resolve();
      }, 1000)
    })
  });


myCar.hooks.brake.call();
myCar.hooks.accelerate.call(10);

console.time('cost');

//执行异步钩子
myCar.hooks.calculateRoutes.promise('Async', 'hook', 'demo')
  .then(() => {
    console.timeEnd('cost');
  }, err => {
    console.error(err);
    console.timeEnd('cost');
  });


/**
 * 打印：
 * --WarningLampPlugin
 * --Accelerating to 10
 * --tapPromise to Async hook demo
 * cost: 1.005s
 */