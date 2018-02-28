#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
//child_process.exec的拓展
const shell = require("shelljs");
//const Git = require("nodegit");
const exec = require('child_process').exec;

const Setting = require('../modules/Setting');

/** 获取参数 ****/
//获取初始化的数据
let init_type_keys = Object.keys(Setting.Commands.init.type),
	init_type_values = Object.values(Setting.Commands.init.type);
//拼接初始化的说明
let init_ops_texts = "";
for(let x = 0;x<init_type_keys.length;x++){
	init_ops_texts += '\n[' + init_type_keys[x] + '] ' + init_type_values[x].text;
}

const ztgame = async function(){
	/////处理全局的命令
	program
		.version('0.0.1')
		.usage('[options]');

	//inti初始化项目
	program
		.command('init')
		.alias('it')
		.description('初始化命令')
		.option('-t, --type [type]', init_ops_texts + '\n')
		.option('-g, --gametype [type]', '项目（游戏）简称')
		.action(function(option){
			/*if( (option.type == undefined) || (typeof option.type === 'boolean') || (option.gametype == undefined) || (typeof option.gametype === 'boolean') ){
				console.log('you can use: ztgame init -t [value] -g [value]');
				return false;
			};*/
			////通过参数获取对应的信息
			if( !!option && (typeof option.type == 'string') && (typeof option.gametype == 'string') ){
				let _reqInfo = reqInfo(option.type),
					_gametype = option.gametype;
				/////有快捷参数, 项目类型和游戏类型都有,问答文件夹名和是否分享
				let qslist = [Setting.questions[0]];
				if(_reqInfo.ism) qslist.push(Setting.questions[3]); ///通过模板类型判断是否问答分享
		      	///添加项目名称
		  		inquirer.prompt(qslist).then((ans) => {
			      	////直接创建对应的模版文件
			  		let ops = {
						url: _reqInfo.url, //clone地址
						text: _reqInfo.text, //clone说明
						fileName: ans.sender.name,  //文件夹
						type: _reqInfo.type, //项目类型
						gametype: _gametype, //游戏类型
						build: _reqInfo.build, //构建类型
						isShare: !!ans.sender.isShare //微信分享
					}
		  			gitClone(ops)
				});
				return false;
			};

			////////没有完整的参数
	  		///未使用快捷参数，进入问答逻辑
	  		inquirer.prompt([Setting.questions[1], Setting.questions[2], Setting.questions[3], Setting.questions[0]]).then((ans) => {
				//通过type判断,charAt截取第一个字符
				let _reqInfo = reqInfo(ans.sender.type.charAt(0)),
					_gametype =  ans.sender.game.split(' ')[0];
				////创建对应的模版文件,clone地址，clone说明，文件夹，项目类型，游戏类型，构建类型，是否分享
				let ops = {
					url: _reqInfo.url, //clone地址
					text: _reqInfo.text, //clone说明
					fileName: ans.sender.name,  //文件夹
					type: _reqInfo.type, //项目类型
					gametype: _gametype, //游戏类型
					build: _reqInfo.build, //构建类型
					isShare: !!ans.sender.isShare || false //默认无微信分享
				}
	  			gitClone(ops)
			});

		});

	//单独处理sass
	/*program
		.command('sass')
		.alias('sa')
		.description('sass转化css')
		.option('--w', '监听sass变化，自动执行编译' + "\n")
		.action(function(option){
			console.log(option)
		});*/

	//开启
	program.parse(process.argv);
	/* 命令行流程 e*/

	///////获取clone地址，文字，构建工具, 模板类型，是否适合移动端
	function reqInfo(type){
		let _type = type;
		//获取默认的参数
		if(_type == undefined) _type = Setting.Commands.init.default.type;
		let url = "",
			text = "",
			build = "",
			ism = false;

		for(let x = 0;x<init_type_keys.length;x++){
			if(init_type_keys[x] == _type){
				let vas = init_type_values[x];
				text = chalk.blue('\n成功clone ' + vas.text);
		  		url = vas.url;
		  		build = vas.build;
		  		ism = !!vas.ism;
			}
		};
	  	return {url : url, text: text, build: build, type: _type, ism: ism}
	}
	//git克隆数据，
	function gitClone(option){
		console.log("\n请稍等，开始clone项目中...\n")
		//克隆模版
		exec(`git clone http://${option.url} ${option.fileName}`, (error, stdout, stderr) => {
		/*Git.Clone(`http://leo:hfhleo001@${option.url}`, option.fileName).then(function(repository) {*/
			//子进程错误
			if (error) {
			    console.error(`exec error: ${error}`);
			    return;
			}

			console.log(option.text + "\n");
			console.log("\n" + chalk.red("开始初始化内容") + "\n");

	  		/////开始修改对应的模版文件
	  		initProject(option);
		})
	}
	/////初始化项目文件，clone地址，clone说明，文件夹，项目类型，游戏类型，构建类型，是否分享
	async function initProject(opt){
		let gametypeinfo = Setting.gametype[opt.gametype];
		/*### 循环遍历需要替换的内容 ###*/
		for(let i in Setting.replaces){
			let _node = Setting.replaces[i],
				_file = "./" + opt.fileName + _node.file(opt.build), //file需要判断构建类型来判断是哪个文件，统计除外
				_template =  _node.template(gametypeinfo.id, gametypeinfo.other_name, opt.fileName, gametypeinfo); //template需要统计id和统计类型，项目名,是否是项目本身提供
			//微信统计替换判断, 是微信但是不分享则跳出
			if(_node.name=="weixinshare" && !!!opt.isShare) continue;
			///遍历修改, 路径，替换关键字，替换后的内容
			let ret1 = await modifyFile(_file, _node.key, _template);
		};

		//启动构建工具
		startPage(opt.fileName, opt.build);
	}	
	////启动项目，项目文件夹名字，构建类型
	function startPage(fileName, build){
		//exec('cat /dev/urandom |od -x|head -n 1', (error, stdout, stderr) => {})
		//进入目录
		shell.cd(fileName);

		//install 
		shell.exec('npm install');

		/////////////执行构建
		//判断是否全局有对应的工具
		if (!shell.which(build)) shell.exec('npm install '+ build +' -g');
		//启动服务
		shell.exec(build);
		shell.exit(1);

		shell.echo(build + '服务已经启动！');
	};
	/////修改文件
	function modifyFile(filePath, replaceKey, replaceString){
		return new Promise(function(resolve, reject) {
			// 修改文件内容，统计代码，微信分享，接口代理
			fs.readFile(filePath, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var regx = new RegExp(replaceKey, 'g');
				var result = data.replace(regx, replaceString);

				fs.writeFile(filePath, result, 'utf8', function (err) {
					if (err) return console.log(err);
					resolve(filePath);
				});
			});
		})
	}
};

ztgame();
