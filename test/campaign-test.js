const { expect } = require("chai");

describe("CampaignFactory", async () => {
    const [owner, addr1] = await ethers.getSigners();
    let campaign;

    beforeEach(async () => {
        const Campaign = await ethers.getContractFactory("Campaign");
        campaign = await Campaign.deploy(1, owner.address);

        await campaign.deployed();
    });

    it("Should create Campaign with defaults", async () => {
        expect(campaign).to.exist;
        expect(await campaign.minimumContribution()).to.equal(1);
        expect(await campaign.manager()).to.equal(owner);
        expect(await campaign.countContributors()).to.equal(0);
        expect(await campaign.countSpendRequests()).to.equal(0);
    });

    describe("Contribute to the Campaign", async () => {
        it("Can contribute to the Campaign", async () => {
            const result = await campaign.connect(addr1).contribute({value: 50});

            expect(result).to.exist;
            expect((await campaign.countContributors()).toNumber()).to.equal(1);
            expect(await campaign.contributors(addr1.address)).to.be.true;
        });

        it("Prevents the same address contributing multiple times", async () => {
            const result = await campaign.connect(addr1).contribute({value: 50});
            expect(result).to.exist;

            try {
                await campaign.connect(addr1).contribute({value: 50});
                expect(false).to.be.true;
            } catch (e) {
                expect(e.message).to.contain("Already contributed");
            }
        });

        it("Must contribute the minimum amount required", async () => {
            try {
                await campaign.connect(addr1).contribute({value: 0});
                expect(false).to.be.true;
            } catch (e) {
                expect(e.message).to.contain("Contribution amount is too low");
            }
        });
    });

    describe("Create a Spend Request", async () => {
        it("Can create a Spend Request", async () => {
            await campaign.createSpendRequest("materials", 50, addr1.address);

            expect((await campaign.countSpendRequests()).toNumber()).to.equal(1);
        });

        it("Only the owner can create a Spend Request", async () => {
            try {
                await campaign.connect(addr1).createSpendRequest("materials", 50, addr1.address);
                expect(false).to.be.true;
            } catch (e) {
                expect(e.message).to.contain( "Sender must be the contract owner");
            }
        });
    });

    describe("Approve a Spend Request", async () => {
        it("Contributor can approve a Spend Request", async () => {
            await campaign.createSpendRequest("materials", 50, addr1.address);
            await campaign.connect(addr1).approveSpendRequest(0);

            expect((await campaign.countSpendRequests()).toNumber()).to.equal(1);
            expect((await campaign.spendRequests(0)).countApproved.toNumber()).to.equal(1);
        });

        it("Can't approve a completed Spend Request", async () => {
            // todo
        });

        it("Contributor can only approve a Spend Request once", async () => {
            await campaign.createSpendRequest("materials", 50, addr1.address);
            await campaign.connect(addr1).approveSpendRequest(0);

            try {
                await campaign.connect(addr1).approveSpendRequest(0);
                expect(false).to.be.true;
            } catch (e) {
                expect(e.message).to.contain("Already approved Spend Request");
            }
        });
    });

    describe("Finalise a Spend Request", async () => {
        it("Can finalise a Spend Request", async () => {
            // todo
        });

        it("Only allows the owner to finalise a Spend Request", async () => {
            // todo
        });

        it("Can't finalise a completed Spend Request", async () => {
            // todo
        });

        it("Requires over 50% of approvals to finalise a Spend Request", async () => {
            // todo
        });

        it("Can get the total number of Spend Requests", async () => {
            // todo
        });
    });
});