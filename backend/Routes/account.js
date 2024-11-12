const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
const router = express.Router();

//an endpoint for user to get their balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        });

        // If no account is found, return an error
        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching account balance:", error);
        res.status(500).json({
            message: "An error occurred while fetching the account balance"
        });
    }
});


//endpoint to transfer money to another account
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
        session.startTransaction();
        
        const { amount, to } = req.body;
        
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        // Fetch the account of the sender
        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        // Fetch the recipient's account
        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error during transaction:", error);
        res.status(500).json({
            message: "An error occurred during the transfer"
        });
    } finally {
        session.endSession();
    }
});


module.exports = router;