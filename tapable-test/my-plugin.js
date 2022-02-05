const Compiler = require('./Compiler')

class MyPlugin {
  constructor() {

  }
  // 监听 hook
  apply(compiler) {
    compiler.hooks.brake.tap("WarningLampPlugin", () =>
      console.log('==WarningLampPlugin'));
    compiler.hooks.accelerate.tap("LoggerPlugin", newSpeed =>
      console.log(`==Accelerating to ${newSpeed}`));
    compiler.hooks.calculateRoutes.tapPromise("calculateRoutes tapAsync",
      (source, target, routesList) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`==tapPromise to ${source} ${target} ${routesList}`)
            resolve();
          }, 2000)
        });
      });
  }
}

// 模拟插件执行
const myPlugin = new MyPlugin();

const options = {
  plugins: [myPlugin]
}

const compiler = new Compiler();

for (const plugin of options.plugins) {
  if (typeof plugin === "function") {
    plugin.call(compiler, compiler);
  } else {
    plugin.apply(compiler); //插件监听compiler的hooks
  }
}
compiler.run(); //开始编译，内部会触发一系列的hooks