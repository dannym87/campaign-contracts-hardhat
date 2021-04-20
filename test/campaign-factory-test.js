const { expect } = require("chai");

describe("CampaignFactory", function() {
  let campaignFactory;

  beforeEach(async () => {
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    campaignFactory = await CampaignFactory.deploy();

    await campaignFactory.deployed();
  });

  it("Can deploy a new CampaignFactory Contract", async () => {
    expect(await campaignFactory.getDeployedCampaigns()).to.have.lengthOf(0);
  });

  it("Can deploy a new Campaign Contract", async () => {
    await campaignFactory.createCampaign(1);

    expect(await campaignFactory.getDeployedCampaigns()).to.have.lengthOf(1);
  });

  it("Receives an invalid minimum contribution", async () => {
    try {
      await campaignFactory.createCampaign("invalid minimumContribution");
      expect(false).to.be.true;
    } catch (e) {
      expect(e).to.exist;
    }
  });
});
