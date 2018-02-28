#!/usr/bin/env node

var cwd = require('cwd'),
	//rd = require('rd'),
	readJsonSync = require('read-json-sync'),
	fileRead = require('file-read'),
	program = require('commander'),
	fs = require('fs'),
	path = require('path'),
	inquirer = require('inquirer'),
	chalk = require('chalk'),
	//child_process.exec的拓展
	shell = require("shelljs"),
	//Git = require("nodegit"),
	exec = require('child_process').exec;

const packageFile = cwd() + path.sep + 'zt-package.json'; //配置文件

/*fileRead(cwd() + cfile, {
			size: '100000', //字节
			flag: 'r', //读取
			encoding: 'utf8',
			tail: false //尾部读取
		}, (err, res) => {
			if( err ){
				console.error(err);
				return;
			}
			console.log(res)
		})*/
console.log(packageFile)
const packageJson = readJsonSync(packageFile);
const packages = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);


/** 获取参数 ****/
const zpm = async function(){
	/////处理全局的命令
	program
		.version('0.0.1')
		.usage('<command> [options]');
		
	//inti初始化项目
	program
		.command('install')
		.alias('it')
		.description('安装命令')
		.option('-g, --global', '是否全局')
		.option('-v, --ver [type]', '安装的版本')
		.option('-s, --save', '安装到dependencies')
		.option('-d, --save-dev', '安装到devDependencies')
		.action(function(command, option){
			////通过参数获取对应的信息
			//console.log(1 ,typeof command)
			//console.log(2 ,option)
			//console.log(3 ,option.saveDev)
			//console.log(4 ,option.save)
			//console.log(5 ,option.ver)
			////如果未传安装包名,则查询配置文件安装
			if(typeof command !=='string'){
				////解析列表
				analysis(packages)
				return false;	
			}
			//判断版本
			let _version = ( !!option&&(typeof option.ver=='string') )? option.ver: 'master',
				_save = ( !!option&& !!option.save )? true: false,//是否修改配置添加到dependencies
				_saveDev = ( !!option&& !!option.saveDev )? true: false;//是否修改配置添加到devDependencies
			////单独安装包
			analysis({name: command, ver: _version, save: _save, saveDev: _saveDev}, true)
			//installPackage(command, _version);
		});
	program
		.command('uninstall')
		.alias('uit')
		.description('卸载模块命令')
		.option('-g, --global', '是否全局卸载')
		.action(function(command, option){
			////通过参数获取对应的信息
			console.log(1 ,command)
			//console.log(2 ,option)
			////把zt-package.json的内容删除
			if(typeof command ==='string'){
				removeModule(command)
			}else{
				console.log(chalk.red("参数错误"))
			}
		});

	//开启
	program.parse(process.argv);
	/* 命令行流程 e*/
	///解析安装
	async function analysis(packages, isone){
		console.log(packages)
		let list = chalk.red("成功安装：") + "\n";
		//一个包
		if(!!isone){
			let ret = await installPackage(packages.name, packages.ver);
			////把内容写入zt-package.json
			let packagev = await modifyPackage(packages, true);
			console.log(5, packagev)
			list += chalk.red(ret) + "\n";
		}else{
			for(let name in packages){
				let ret = await installPackage(name, packages[name]);
				list += chalk.red(ret) + "\n";
			};
		};
		//输出提示
		console.log("\n" + list + "\n");
	}
	/////安装
	function installPackage(package, version){
		if(version==""){console.log(package + chalk.red("未声明版本，请检查配置！")); return false;}

		let _version = version=="master"? "master": ("v" + version);
			clonecmd = `git clone --progress -b ${_version} http://git.dev.ztgame.com/leo/${package}.git zt_modules/${package}`;

		return new Promise(function(resolve, reject) {
			///////判断文件是否存在了
			let modulepath = cwd() + path.sep + 'zt_modules' + path.sep + package;
			if(fs.existsSync(modulepath)) {

				resolve("" + package + ": " + version + "   is already install");
			}else{
				console.log("\n请稍等，开始安装" + package);
				//克隆模版
				exec(clonecmd, (error, stdout, stderr) => {
				/*Git.Clone(`http://leo:hfhleo001@${option.url}`, option.fileName).then(function(repository) {*/
					//子进程错误
					if (error) {
					    console.error(`exec error: ${error}`);
					    return;
					}
					resolve("" + package + ": " + version);
				})
			};
		})
	};
	/////修改package.json文件
	function modifyPackage(opt, isInstall){
		let pname = opt.name,
			pver = opt.ver,
			save = opt.save,
			saveDev = opt.saveDev;
		//let modulepath = cwd() + path.sep + 'zt_modules' + path.sep + pname;

		return new Promise(function(resolve, reject){
			//////是安装，rg
			if(!!isInstall){
				if(save||saveDev){
					if(!!save){
						//只有在没有对象的时候才修改
						if(!!!packageJson.dependencies[pname]) packageJson.dependencies[pname] = pver;
					}else{
						if(!!!packageJson.devDependencies[pname]) packageJson.devDependencies[pname] = pver;
					};
					// 修改文件Package
					fs.writeFile(packageFile, JSON.stringify(packageJson, null, 2), 'utf8', function (err) {
						if (err) return console.log(err);
						resolve({path: packageFile, pname: pname, pver: pver, msg: '配置安装成功'});
					});
				}else{
					resolve({path: packageFile, msg: '不需要修改配置'});
				};
			}else{//删除
				if(!!packageJson.dependencies[pname]) delete packageJson.dependencies[pname];
				if(!!packageJson.devDependencies[pname]) delete packageJson.devDependencies[pname];
				//console.log(10, packageJson)
				fs.writeFile(packageFile, JSON.stringify(packageJson, null, 2), 'utf8', function (err) {
					if (err) return console.log(err);
					resolve({path: packageFile, pname: pname, pver: pver, msg: '删除成功'});
				});
			}
		})
	};
	async function removeModule(module){
		//删除配置信息
		let packagev = await modifyPackage({name: module});
		let modulepath = cwd() + path.sep + 'zt_modules' + path.sep + module;
		//递归删除文件夹
		deleteFile(modulepath);
		console.log(chalk.red(packagev.pname + "卸载成功"))
	}
	function deleteFile(mpath) {  
	    var files = [];
	    //文件存在
	    if(fs.existsSync(mpath)) {  
	        files = fs.readdirSync(mpath);//返回一个不包括 '.' 和 '..' 的文件名的数组。

	        files.forEach(function(file, index) {  
	            var curPath = mpath + path.sep + file;//当前文件 
	            if(fs.statSync(curPath).isDirectory()) { // recurse 
	            	//递归
	                deleteFile(curPath);  
	            } else { 
	            	// delete file  
	                fs.unlinkSync(curPath);  
	            }  
	        });
	        ////删除模块文件夹
	        fs.rmdirSync(mpath);  
	    }  
	};  
};

zpm();
