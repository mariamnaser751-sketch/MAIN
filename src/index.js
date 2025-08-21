// // require the readline library
// // require the eventBus and store from the respective files
// // require("./listeners"); // attach listeners

// // const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// // const readline = require('readline');

// function help() {
//     console.log(`
// Commands:
//   help                         Show this help
//   exit                         Quit
//   new                          Create a new order (interactive)
//   list                         List orders
//   pay <id>                     Mark order paid
//   pack <id>                    Mark order packed
//   ship <id>                    Mark order shipped
//   cancel <id>                  Cancel order
//   stats                        Show count per status
// `);
// }

// function ask(q, cb) { rl.question(q, cb); }

// function cmdNew() {
//     // Multi-step prompt → emit order:created or error
//     ask("Customer name: ", (customer) => {
//         ask("Item name: ", (item) => {
//             ask("Quantity: ", (qtyText) => {
//                 const qty = Number(qtyText.trim());
//                 const res = store.createOrder(customer, item, qty);
//                 if (!res.ok) {
//                     // Emit error via bus, keep CLI running
//                     bus.emit("error", new Error(res.error));
//                     return prompt();
//                 }
//                 // Emit the creation event
//                 bus.emit("order:created", res.order);
//                 console.log(`Created order #${res.order.id} (status=new)`);
//                 prompt();
//             });
//         });
//     });
// }

// function cmdList() {
//     const list = store.list();
//     if (list.length === 0) {
//         console.log("(no orders yet)");
//     } else {
//         // loop on purpose
//         for (let i = 0; i < list.length; i++) {
//             const o = list[i];
//             console.log(`#${o.id}  ${o.customer}  ${o.item} x${o.qty}  [${o.status}]`);
//         }
//     }
//     prompt();
// }

// function cmdStats() {
//     // Count by status using Object.keys/values logic + loops
//     const byStatus = {}; // e.g., { new:2, paid:1, ... }
//     const list = store.list();
//     for (let i = 0; i < list.length; i++) {
//         const s = list[i].status;
//         byStatus[s] = (byStatus[s] || 0) + 1;
//     }
//     const names = Object.keys(byStatus);
//     if (names.length === 0) console.log("(no orders)");
//     for (let i = 0; i < names.length; i++) {
//         const k = names[i];
//         console.log(`${k}: ${byStatus[k]}`);
//     }
//     prompt();
// }

// function doTransition(evName, idText) {
//     const id = Number((idText || "").trim());
//     if (!Number.isFinite(id)) {
//         console.log("Please provide a valid numeric id.");
//         return prompt();
//     }
//     // Emit transition event; listeners validate flow
//     bus.emit(evName, { id });
//     prompt();
// }

// function parse(line) {
//     const parts = line.trim().split(/\s+/);
//     return { cmd: parts[0] || "", args: parts.slice(1) };
// }

// function prompt() {
//     rl.question("flow> ", (line) => {
//         const { cmd, args } = parse(line);

//         if (cmd === "") return prompt();
//         if (cmd === "help") { help(); return; }
//         if (cmd === "exit" || cmd === "quit") { rl.close(); return; }

//         if (cmd === "new") return cmdNew();
//         if (cmd === "list") return cmdList();
//         if (cmd === "stats") return cmdStats();

//         if (cmd === "pay") return doTransition("order:paid", args[0]);
//         if (cmd === "pack") return doTransition("order:packed", args[0]);
//         if (cmd === "ship") return doTransition("order:shipped", args[0]);
//         if (cmd === "cancel") return doTransition("order:canceled", args[0]);

//         console.log("Unknown command. Try 'help'.");
//         prompt();
//     });
// }

// // Boot
// console.log("Order Flow CLI — EventEmitter practice");
// help();
// prompt();



// /////////////////////////////////////////////////////////////////////////////////////////////////




const readline = require('readline');
const bus = require('./eventBus');
const store = require('./store');
require('./listeners'); 


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function help() {
  console.log(`
Commands:
  help                         Show this help
  exit / quit                  Quit
  new                          Create a new order (interactive)
  list                         List orders
  pay <id>                     Mark order paid
  pack <id>                    Mark order packed
  ship <id>                    Mark order shipped
  cancel <id>                  Cancel order
  stats                        Show count per status
  `);
}

function ask(q, cb) { rl.question(q, cb); }

function cmdNew() {
  ask("Customer name: ", (customer) => {
    ask("Item name: ", (item) => {
      ask("Quantity: ", (qtyText) => {
        const qty = Number(qtyText.trim());
        const res = store.createOrder(customer, item, qty);
        if (!res.ok) {
          bus.emit("error", new Error(res.error));
          return prompt();
        }
        bus.emit("order:created", res.order);
        console.log(`Created order #${res.order.id} (status=new)`);
        prompt();
      });
    });
  });
}

function cmdList() {
  const list = store.list();
  if (list.length === 0) {
    console.log("(no orders yet)");
  } else {
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      console.log(`#${o.id}  ${o.customer}  ${o.item} x${o.qty}  [${o.status}]`);
    }
  }
  prompt();
}

function cmdStats() {
  const byStatus = {};
  const list = store.list();
  for (let i = 0; i < list.length; i++) {
    const s = list[i].status;
    byStatus[s] = (byStatus[s] || 0) + 1;
  }
  const names = Object.keys(byStatus);
  if (names.length === 0) console.log("(no orders)");
  for (let i = 0; i < names.length; i++) {
    const k = names[i];
    console.log(`${k}: ${byStatus[k]}`);
  }
  prompt();
}

function doTransition(evName, idText) {
  const id = Number((idText || "").trim());
  if (!Number.isFinite(id)) {
    console.log("Please provide a valid numeric id.");
    return prompt();
  }
  bus.emit(evName, { id });
  prompt();
}

function parse(line) {
  const parts = line.trim().split(/\s+/);
  return { cmd: parts[0] || "", args: parts.slice(1) };
}

function prompt() {
  rl.question("flow> ", (line) => {
    const { cmd, args } = parse(line);

    if (cmd === "") return prompt();
    if (cmd === "help") { help(); return prompt(); }
    if (cmd === "exit" || cmd === "quit") { rl.close(); return; }

    if (cmd === "new") return cmdNew();
    if (cmd === "list") return cmdList();
    if (cmd === "stats") return cmdStats();

    if (cmd === "pay") return doTransition("order:paid", args[0]);
    if (cmd === "pack") return doTransition("order:packed", args[0]);
    if (cmd === "ship") return doTransition("order:shipped", args[0]);
    if (cmd === "cancel") return doTransition("order:canceled", args[0]);

    console.log("Unknown command. Try 'help'.");
    prompt();
  });
}

// Boot
console.log("Order Flow CLI — EventEmitter practice");
help();
prompt();



