export function backReview(phrase) {
	if (phrase.factor > 10) {
		phrase.factor -= 30;

	} else if (phrase.factor > 1) {
		phrase.factor--;
	}

	phrase['review'] = calculateDate(1);
	return phrase;
}

export function subtractDate(sub) {
	let date = new Date();
	date.setDate(date.getDate() - sub);
	let year = date.getUTCFullYear();
	let month = date.getUTCMonth() + 1;
	let day = date.getUTCDate();
	return year + '-' + month + '-' + day;
}

export function calculateDate(sum) {
	let date = new Date();
	date.setDate(date.getDate() + sum);
	let year = date.getUTCFullYear();
	let month = date.getUTCMonth() + 1;
	let day = date.getUTCDate();
	return year + '-' + month + '-' + day;
}

export function nextReview(phrase) {
	if (phrase.factor < 6) {
			phrase.factor++;
			phrase['review'] = calculateDate(1);

	} else if (phrase.factor < 11) {
		phrase.factor++;
		phrase['review'] = calculateDate(7);

	} else if (phrase.factor == 11) {
		phrase.factor = 30;
		phrase['review'] = calculateDate(30);

	} else {
		phrase.factor += 30;
		phrase['review'] = calculateDate(phrase.factor);
	}
	
	return phrase;
}

export async function offlineMessage() {
	alert('Você está offline!');
}