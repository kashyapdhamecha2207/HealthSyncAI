// AI Controller for Symptom Checking

exports.checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ message: 'Please provide symptoms text' });
    }

    const lowerSymptoms = symptoms.toLowerCase();
    
    // Fallback Rule-Based Algorithm for the Client Demo
    // (In production, replace with OpenAI or similar LLM)
    const ruleBase = [
      { keywords: ['heart', 'chest pain', 'palpitation', 'breath'], department: 'Cardiology', urgency: 'High', advice: 'Please book an appointment with a Cardiologist immediately.' },
      { keywords: ['bone', 'joint', 'fracture', 'knee', 'back pain'], department: 'Orthopedics', urgency: 'Medium', advice: 'An Orthopedic specialist can help evaluate your bone/joint issues.' },
      { keywords: ['skin', 'rash', 'itch', 'acne', 'mole'], department: 'Dermatology', urgency: 'Low', advice: 'A Dermatologist can review your skin condition.' },
      { keywords: ['headache', 'dizzy', 'seizure', 'numbness'], department: 'Neurology', urgency: 'High', advice: 'Please consult a Neurologist for these nervous system symptoms.' },
      { keywords: ['stomach', 'digestion', 'acid', 'vomit', 'diarrhea'], department: 'Gastroenterology', urgency: 'Medium', advice: 'A Gastroenterologist should evaluate your digestive symptoms.' },
      { keywords: ['eye', 'vision', 'blur', 'blind'], department: 'Ophthalmology', urgency: 'Medium', advice: 'Please see an Ophthalmologist.' },
      { keywords: ['tooth', 'teeth', 'gum', 'mouth'], department: 'Dentistry', urgency: 'Low', advice: 'Book an appointment with a Dentist.' }
    ];

    let match = null;
    for (let rule of ruleBase) {
      for (let keyword of rule.keywords) {
        if (lowerSymptoms.includes(keyword)) {
          match = rule;
          break;
        }
      }
      if (match) break;
    }

    if (match) {
      res.json({
        department: match.department,
        urgency: match.urgency,
        advice: match.advice,
        disclaimer: 'This AI is for informational purposes only and is not a substitute for professional medical advice.'
      });
    } else {
      res.json({
        department: 'General Physician',
        urgency: 'Low',
        advice: 'Your symptoms are general. A General Physician is a good starting point for evaluation.',
        disclaimer: 'This AI is for informational purposes only and is not a substitute for professional medical advice.'
      });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
