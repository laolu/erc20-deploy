const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let myToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // 获取合约工厂
    const MyToken = await ethers.getContractFactory("MyToken");
    
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // 部署合约
    myToken = await MyToken.deploy("My Token", "MTK");
  });

  describe("部署", function () {
    it("应该设置正确的名称和符号", async function () {
      expect(await myToken.name()).to.equal("My Token");
      expect(await myToken.symbol()).to.equal("MTK");
    });

    it("应该将所有代币分配给部署者", async function () {
      const totalSupply = await myToken.totalSupply();
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
    });
  });

  describe("交易", function () {
    it("应该能够转账代币", async function () {
      // 转账100个代币给addr1
      const transferAmount = ethers.parseEther("100");
      await myToken.transfer(addr1.address, transferAmount);
      
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("应该在余额不足时失败", async function () {
      const initialBalance = await myToken.balanceOf(addr1.address);
      await expect(
        myToken.connect(addr1).transfer(addr2.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
}); 