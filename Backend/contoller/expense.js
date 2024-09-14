
const Expense = require('../models/Expense');
const User= require('../models/User');
require('dotenv').config();

// let userId;

exports.addExpense = async (req, res, next) => {
    try {
        const user = req.user;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const date = new Date().toISOString().split('T')[0];
        let newExpenseDetail;
        
        const expense = new Expense({ amount: amount, description: description, category: category, userId: user , date: date});
        expense.save()
            .then(result => {
                newExpenseDetail = result;
                user.totalexpenses = user.totalexpenses + parseInt(amount)
                user.save()
            })
            .then(result2 => {
                res.status(201).json({ newExpenseDetail: newExpenseDetail});
                console.log('SUCCESSFULLY ADDED');
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err })
    }
}


exports.getExpenses = (req, res, next) => {
    const page = parseInt(req.query.page);
    let ITEMS_PER_PAGE = parseInt(req.query.pageSize);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    let totalItems;
    Expense.countDocuments({ "userId": req.user._id })
        .then((total) => {
            totalItems = total;
            return Expense.find({ "userId": req.user._id }).skip(offset).limit(ITEMS_PER_PAGE);
        })
        .then((expenses) => {
            res.status(200).json({
                allExpenses: expenses,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1
            })
        })

    // Expense.count({ where: { userId: req.userId } })
    //     .then((total) => {
    //         totalItems = total;
    //         return Expense.findAll({
    //             where: { userId: req.userId },
    //             limit: ITEMS_PER_PAGE,
    //             offset: (page - 1) * ITEMS_PER_PAGE,
    //             attributes: [
    //                 'id',
    //                 'expense_amount',
    //                 'description',
    //                 'category',
    //                 [sequelize.literal("DATE_FORMAT(updatedAt, '%d-%m-%Y')"), 'date']
    //             ]
    //         })
    //     })
    //     .then((expenses) => {
    //         res.status(200).json({
    //             allExpenses: expenses,
    //             currentPage: page,
    //             hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    //             nextPage: page + 1,
    //             hasPreviousPage: page > 1,
    //             previousPage: page - 1,
    //             lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    //         })
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500).json({ error: err });
    //     })
}


// exports.deleteExpense = async (req, res, next) => {
//     try {
//         console.log("yaha tk toh sb sahi hai..");
//         const user = req.user;
//         const expenseId = req.params.id;
//         const expense = await Expense.findById(expenseId);
//         console.log("yaha tk bhi sb sb sahi hai..");
//         const amount = expense.amount;

//         user.totalexpenses = user.totalexpenses - parseInt(amount);
//         console.log("yaha tk bhi sb sb sahi hai..##");
//         user.save()
//             .then(result => {
//                 return Expense.findByIdAndDelete(expenseId)
//             })
//             .then(result => {
//                 console.log('SUCCESSFULLY DELETED');
//                 res.sendStatus(200);
//             })
//             .catch(async (err) => {
//                 console.log(err);
//             })
//     } catch (err) {
//         res.status(500).json(err);
//     }
// }



exports.deleteExpense = async (req, res, next) => {
    try {
        console.log("Reached the delete controller function...");

        const user = req.user;
        const expenseId = req.params.id;
        
        // Find the expense by ID
        const expense = await Expense.findById(expenseId);
        
        // If the expense doesn't exist, return an error
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const amount = expense.amount;

        // Subtract the expense amount from the user's total expenses
        user.totalexpenses = user.totalexpenses - parseInt(amount);
        
        // Save the updated user
        await user.save();

        // Delete the expense
        await Expense.findByIdAndDelete(expenseId);

        console.log('SUCCESSFULLY DELETED');
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete the expense' });
    }
};


exports.updateExpense = async (req, res) => {
    try {
        console.log("controller layer meint ho hai..");
        const userId = req.userId;
        const expenseId = req.params.id;
        const { amount, description, category } = req.body;

        // Find the existing expense
        const existingExpense = await Expense.findById(expenseId);

        if (!existingExpense) {
            console.log("expense not found..");
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the user's total expenses if the amount has changed
        if (amount !== undefined && amount !== existingExpense.amount) {
            const user = await User.findById(userId);
            user.totalexpenses = user.totalexpenses - existingExpense.amount + parseInt(amount);
            await user.save();
        }

        // Update the expense details
        existingExpense.amount = amount !== undefined ? amount : existingExpense.amount;
        existingExpense.description = description || existingExpense.description;
        existingExpense.category = category || existingExpense.category;

        // Save the updated expense
        const updatedExpense = await existingExpense.save();
        console.log("expense updated..");

        res.status(200).json({
            message: 'Expense updated successfully',
            expense: updatedExpense,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update the expense', error: err.message });
    }
};
