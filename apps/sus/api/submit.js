// api/submit.js – Enhanced SUS serverless function with score calculation
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { participantId, condition, responses, susScore, susGrade, susAdjective } = req.body || {};

  if (!participantId || !condition || !responses) {
    return res.status(400).json({ error: 'Invalid payload: missing required fields' });
  }

  // Validate that we have 10 responses
  const responseCount = Object.keys(responses).filter(key =>
    responses[key] !== null && responses[key] !== undefined
  ).length;

  if (responseCount !== 10) {
    return res.status(400).json({
      error: `Expected 10 responses, got ${responseCount}`,
      responses: responses
    });
  }

  try {
    // Build CSV with enhanced structure including SUS metrics
    const header = 'Participant,Condition,Question,Response,SUS_Score,SUS_Grade,SUS_Adjective\n';

    // Generate individual question rows
    const questionRows = Array.from({ length: 10 }, (_, i) => {
      const questionNum = i + 1;
      const response = responses[i];

      // Handle missing responses
      if (response === null || response === undefined) {
        console.warn(`Missing response for question ${questionNum}`);
        return [
          participantId,
          condition,
          `Q${questionNum}`,
          'NULL',
          susScore || 'N/A',
          susGrade || 'N/A',
          susAdjective || 'N/A'
        ].join(',');
      }

      return [
        participantId,
        condition,
        `Q${questionNum}`,
        response,
        susScore || 'N/A',
        susGrade || 'N/A',
        susAdjective || 'N/A'
      ].join(',');
    }).join('\n');

    // Add summary row with overall SUS metrics
    const summaryRow = [
      participantId,
      condition,
      'SUMMARY',
      'COMPLETE',
      susScore || 'N/A',
      susGrade || 'N/A',
      susAdjective || 'N/A'
    ].join(',');

    const csv = header + questionRows + '\n' + summaryRow + '\n';

    // Enhanced filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const sanitizedCondition = condition.replace(/[\s\\/:"*?<>|]+/g, '_');
    const fileName = `${participantId}_${sanitizedCondition}_SUS_${timestamp}.csv`;

    // Stream CSV back for download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    console.log(`SUS CSV generated: ${fileName}`);
    console.log(`SUS Score: ${susScore}, Grade: ${susGrade}, Adjective: ${susAdjective}`);

    return res.status(200).send(csv);

  } catch (error) {
    console.error('Error generating SUS CSV:', error);
    return res.status(500).json({
      error: 'Failed to generate CSV',
      details: error.message
    });
  }
}
