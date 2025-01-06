/**
 * Calculates the total cost for a conference based on the number of papers submitted.
 * @param numberOfPapers - The number of papers submitted to the conference.
 * @param hasPaidSecurityDeposit - Whether the $50 security deposit has been paid.
 * @returns The total cost in USD.
 */
export const calculateTotalCost = (
    numberOfPapers: number,
    hasPaidSecurityDeposit: boolean
): number => {
    let totalCost = 0;

    // Pricing slabs
    if (numberOfPapers <= 100) {
        // Small Size Conference (1–100 papers): Free
        totalCost = 0;
    } else if (numberOfPapers <= 300) {
        // Medium Size Conference (101–300 papers): $1.5/paper
        totalCost = (numberOfPapers - 100) * 1.5;
    } else if (numberOfPapers <= 500) {
        // Large Size Conference (301–500 papers): $1.25/paper
        totalCost = 200 * 1.5 + (numberOfPapers - 300) * 1.25;
    } else {
        // Extra Large Conference (501+ papers): $1/paper
        totalCost = 200 * 1.5 + 200 * 1.25 + (numberOfPapers - 500) * 1;
    }

    // Deduct the $50 security deposit if paid
    if (hasPaidSecurityDeposit) {
        totalCost = Math.max(totalCost - 50, 0); // Ensure the total cost doesn't go below 0
    }

    return totalCost;
};