const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function deployToken(name, symbol) {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  console.log(`开始部署 ${name}...`);
  const token = await MyToken.deploy(name, symbol);
  await token.waitForDeployment();
  
  const tokenAddress = await token.getAddress();
  console.log(`${name} 部署成功！地址:`, tokenAddress);

  if (network.config.chainId === 11155111) {
    console.log("等待区块确认...");
    await token.deployTransaction.wait(5);
    
    console.log("开始验证合约...");
    await hre.run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [name, symbol],
    });
    console.log(`${name} 合约验证成功！`);
  }
  return {
    name,
    symbol,
    address: tokenAddress
  };
}

async function saveDeployment(deployments) {
  // 创建部署信息对象
  const deploymentInfo = {
    network: network.name,
    timestamp: new Date().toISOString(),
    contracts: deployments
  };

  // 确保 deployments 目录存在
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)){
    fs.mkdirSync(deploymentsDir);
  }

  // 创建带有时间戳的文件名
  const fileName = `deployment_${network.name}_${Date.now()}.json`;
  const filePath = path.join(deploymentsDir, fileName);

  // 将部署信息写入文件
  fs.writeFileSync(
    filePath,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`部署信息已保存到: ${filePath}`);
}

async function main() {
  try {
    const deployments = [];

    // 部署 DAI
    const dai = await deployToken("My DAI", "DAI");
    deployments.push(dai);
    console.log("-----------------------------------");

    // 部署 USDT
    const usdt = await deployToken("My USDT", "USDT");
    deployments.push(usdt);
    console.log("-----------------------------------");

    // 部署 USDC
    const usdc = await deployToken("My USDC", "USDC");
    deployments.push(usdc);

    // 打印所有部署的合约地址
    console.log("\n部署总结：");
    deployments.forEach(token => {
      console.log(`${token.name} 地址: ${token.address}`);
    });

    // 保存部署信息
    await saveDeployment(deployments);

  } catch (error) {
    console.error("部署过程中出错:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 