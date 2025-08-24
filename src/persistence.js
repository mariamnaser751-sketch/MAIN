const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function readArrayFromJson(dbFile) {
	try {
		if (!fs.existsSync(dbFile)) return [];
		const raw = fs.readFileSync(dbFile, 'utf8').trim();
		if (!raw) return [];
		const data = JSON.parse(raw);
		return Array.isArray(data) ? data : [];
	} catch (err) {
		console.error(`Failed to read ${dbFile}:`, err.message);
		return [];
	}
}

function writeArrayToJson(arr, dbFile) {
	try {
		ensureDir(dbFile);
		fs.writeFileSync(dbFile, JSON.stringify(arr, null, 2), 'utf8');
	} catch (err) {
		console.error(`Failed to write ${dbFile}:`, err.message);
	}
}

function loadOrders(dbFile) {
	return readArrayFromJson(dbFile);
}

function saveOrders(orders, dbFile) {
	writeArrayToJson(orders, dbFile);
}

module.exports = {
	loadOrders,
	saveOrders
};