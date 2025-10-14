# Hardcoded demo responses for prototype showcase
# This simulates the AI review without actual processing

DEMO_PAPERS = {
    "machine_learning_paper.pdf": {
        "title": "Machine Learning for Climate Prediction",
        "summary": "This paper presents a novel deep learning approach for long-term climate prediction using transformer architectures.",
        "review": """
## Summary
This paper introduces a transformer-based deep learning model for climate prediction, achieving 23% improvement over existing LSTM-based methods. The authors demonstrate strong performance on 10-year prediction horizons using multi-modal climate data.

## Strengths
✅ **Novel Architecture**: The proposed Climate-Former architecture effectively captures long-range temporal dependencies
✅ **Comprehensive Evaluation**: Tested on multiple climate datasets (CMIP6, ERA5)
✅ **Strong Results**: 23% improvement in RMSE over baseline methods
✅ **Reproducibility**: Code and pre-trained models made available

## Weaknesses & Suggested Fixes
⚠️ **Limited Regional Analysis**: The paper focuses on global predictions but lacks region-specific analysis
   → *Fix*: Add section analyzing performance across different climate zones (tropical, temperate, polar)

⚠️ **Computational Cost**: Training requires 8x A100 GPUs for 72 hours but no ablation on model size
   → *Fix*: Include experiments with smaller model variants and efficiency analysis

⚠️ **Data Imbalance**: Training data is heavily weighted toward recent decades
   → *Fix*: Apply temporal reweighting or data augmentation for historical periods

## Suggested Experiments
🔬 **Extreme Events**: Test model's ability to predict rare climate events (hurricanes, droughts)
🔬 **Uncertainty Quantification**: Add ensemble methods or Bayesian layers for confidence intervals
🔬 **Transfer Learning**: Evaluate model's performance when fine-tuned on regional data

## Policy & Ethical Considerations
⚙️ **Data Privacy**: Ensure climate data doesn't inadvertently reveal sensitive location information
⚙️ **Societal Impact**: Climate predictions influence policy decisions - model failures could have serious consequences
⚙️ **Transparency**: Model decisions should be interpretable for policymakers

## Decision: **ACCEPT** (Conditional on minor revisions)
This is strong work that advances climate modeling significantly. Address the regional analysis and computational cost concerns before final publication.
        """,
        "confidence": 0.87
    },
    
    "healthcare_ai.pdf": {
        "title": "AI-Driven Early Detection of Cardiovascular Disease",
        "summary": "Research on using multimodal AI to predict cardiovascular disease risk from ECG, imaging, and patient history data.",
        "review": """
## Summary
This paper presents CardioAI, a multimodal deep learning system for early cardiovascular disease (CVD) detection. The model integrates ECG signals, cardiac imaging (CT/MRI), and electronic health records to predict CVD risk with 91.3% accuracy, outperforming single-modality approaches by 12-15%.

## Strengths
✅ **Clinical Relevance**: Addresses critical healthcare need with significant mortality impact
✅ **Multimodal Integration**: Novel fusion architecture effectively combines heterogeneous medical data
✅ **Large-Scale Study**: Validated on 45,000+ patient records across 3 hospitals
✅ **Explainability**: Includes attention visualization showing which features influence predictions
✅ **Clinical Validation**: Prospective study with cardiologist evaluation

## Weaknesses & Suggested Fixes
⚠️ **Demographic Bias**: Model performance drops 18% on underrepresented ethnic groups
   → *Fix*: Apply fairness constraints during training and collect more diverse data

⚠️ **Data Leakage Risk**: Temporal validation not clearly described
   → *Fix*: Explicitly state that test patients are from future time periods than training

⚠️ **Missing Cost Analysis**: No discussion of implementation costs or resource requirements
   → *Fix*: Add section on computational requirements and cost-benefit analysis

⚠️ **Limited Longitudinal Analysis**: Focuses on point-in-time prediction, not disease progression
   → *Fix*: Include experiments tracking model predictions over time for same patients

## Suggested Experiments
🔬 **Ablation Study**: Systematically remove each modality to quantify individual contributions
🔬 **Cross-Hospital Validation**: Test on completely unseen hospitals to verify generalization
🔬 **Intervention Analysis**: Study if early detection leads to better patient outcomes
🔬 **Real-Time Deployment**: Pilot study integrating model into clinical workflow

## Policy & Ethical Considerations
⚙️ **Medical Liability**: False negatives could have life-threatening consequences - need clear liability framework
⚙️ **Algorithmic Bias**: Demonstrated performance gaps across demographics require mitigation before deployment
⚙️ **Patient Privacy**: HIPAA compliance and de-identification procedures must be rigorously verified
⚙️ **Clinical Integration**: Physicians must retain final decision-making authority

## Decision: **MAJOR REVISION**
Strong clinical motivation and promising results, but demographic bias and validation concerns must be addressed before publication. The fairness issues are critical for a medical AI system.
        """,
        "confidence": 0.92
    },
    
    "quantum_computing.pdf": {
        "title": "Quantum Algorithms for Drug Discovery Optimization",
        "summary": "Novel quantum computing approach to accelerate molecular simulation and drug candidate screening.",
        "review": """
## Summary
This paper introduces QuMolOpt, a variational quantum algorithm for molecular property prediction and drug candidate screening. Using 53-qubit quantum processors, the authors demonstrate 10x speedup on specific molecular simulation tasks compared to classical methods, though with current hardware limitations.

## Strengths
✅ **Timely Research**: Quantum computing for drug discovery is an emerging high-impact area
✅ **Hardware Implementation**: Actual quantum hardware experiments, not just simulations
✅ **Hybrid Approach**: Clever integration of quantum and classical computing components
✅ **Theoretical Foundation**: Strong mathematical analysis of algorithm complexity
✅ **Real Molecules**: Tested on actual pharmaceutical compounds, not toy examples

## Weaknesses & Suggested Fixes
⚠️ **Scalability Unclear**: Results shown for 20-30 atom molecules; unclear if approach scales to drug-sized molecules
   → *Fix*: Provide theoretical analysis or extrapolation studies for 50-100 atom molecules

⚠️ **Noise Robustness**: Quantum noise significantly degrades results but error mitigation is superficial
   → *Fix*: Implement and evaluate multiple error mitigation strategies (ZNE, CDR, PEC)

⚠️ **Limited Baselines**: Only compared to standard DFT, missing modern ML baselines
   → *Fix*: Compare against recent neural network approaches (SchNet, DimeNet, E(n)GNN)

⚠️ **Cherry-Picked Examples**: Success cases highlighted but overall success rate not clearly stated
   → *Fix*: Report aggregate statistics across full benchmark suite

⚠️ **Practical Applicability**: 10x speedup only achieved on quantum-friendly problems
   → *Fix*: Clearly delineate which drug discovery tasks benefit from quantum approach

## Suggested Experiments
🔬 **Scaling Study**: Demonstrate algorithm behavior as molecule size increases
🔬 **Noise Sensitivity**: Systematic study of performance degradation with noise levels
🔬 **End-to-End Pipeline**: Show integration into actual drug discovery workflow
🔬 **NISQ vs Ideal**: Compare results on noisy hardware vs ideal quantum simulator

## Policy & Ethical Considerations
⚙️ **Reproducibility Challenge**: Quantum hardware access is limited - results may be hard to reproduce
⚙️ **Hype vs Reality**: Be careful not to oversell near-term quantum advantages
⚙️ **Resource Allocation**: Quantum computing resources are scarce - justify research priorities
⚙️ **Dual-Use Concerns**: Molecular simulation capabilities could have security implications

## Decision: **ACCEPT** (Conditional on minor revisions)
Solid contribution to quantum computing for chemistry. Address scalability analysis and baseline comparisons. The work advances the field despite current hardware limitations. Revise claims to be more conservative about near-term practical impact.
        """,
        "confidence": 0.78
    }
}

def get_demo_response(filename: str) -> dict:
    """
    Returns hardcoded demo response for showcase purposes
    
    Args:
        filename: Name of the uploaded PDF file
    
    Returns:
        Dict containing title, summary, review, and confidence score
    """
    # Normalize filename
    filename = filename.lower().strip()
    
    # Check if it's one of our demo papers
    for demo_name, response in DEMO_PAPERS.items():
        if demo_name.lower() in filename or any(word in filename for word in demo_name.lower().replace('.pdf', '').split('_')):
            return response
    
    # Default response for unknown papers
    return {
        "title": "General Research Paper",
        "summary": "This paper presents novel research findings in its domain.",
        "review": """
## Summary
This appears to be a research paper. For the best demo experience, please upload one of the sample papers:
- machine_learning_paper.pdf
- healthcare_ai.pdf  
- quantum_computing.pdf

## Default Demo Response
This is a placeholder response. The system would normally analyze your paper and provide:
- Detailed summary of contributions
- Analysis of strengths and weaknesses
- Suggested experiments and improvements
- Policy and ethical considerations
- Publication recommendation

**Note**: This is a prototype demo with hardcoded responses for showcase purposes.
        """,
        "confidence": 0.5
    }

def get_chat_response(question: str, paper_context: dict) -> str:
    """
    Returns hardcoded chat responses based on the question and paper context
    
    Args:
        question: User's question
        paper_context: The paper information from DEMO_PAPERS
    
    Returns:
        String containing the response
    """
    question_lower = question.lower()
    
    # Question about summary
    if any(word in question_lower for word in ["summary", "summarize", "about", "main", "overview"]):
        return f"**Summary**: {paper_context.get('summary', 'This paper presents novel research in its field.')}\n\n{paper_context.get('title', 'Research Paper')}"
    
    # Question about strengths
    if any(word in question_lower for word in ["strength", "good", "positive", "advantage"]):
        return "The paper has several key strengths:\n\n" + "\n".join([line for line in paper_context.get('review', '').split('\n') if '✅' in line][:4])
    
    # Question about weaknesses
    if any(word in question_lower for word in ["weakness", "weak", "limitation", "issue", "problem", "improve"]):
        return "The main weaknesses identified are:\n\n" + "\n".join([line for line in paper_context.get('review', '').split('\n') if '⚠️' in line][:5])
    
    # Question about experiments
    if any(word in question_lower for word in ["experiment", "test", "evaluation", "validate"]):
        return "Suggested additional experiments:\n\n" + "\n".join([line for line in paper_context.get('review', '').split('\n') if '🔬' in line])
    
    # Question about decision
    if any(word in question_lower for word in ["decision", "accept", "reject", "recommend", "verdict"]):
        decision_lines = [line for line in paper_context.get('review', '').split('\n') if 'Decision:' in line]
        return decision_lines[0] if decision_lines else "Based on the review, this paper shows promise but needs revisions."
    
    # Question about methodology
    if any(word in question_lower for word in ["method", "approach", "technique", "algorithm"]):
        return f"Regarding the methodology: {paper_context.get('summary', 'The paper employs novel techniques to address key challenges in the field.')}\n\nThe review highlights both innovative approaches and areas where the methodology could be strengthened."
    
    # Default response
    return f"Based on the paper '{paper_context.get('title', 'this research')}', I can help you understand various aspects including:\n\n" \
           "- Summary and main contributions\n" \
           "- Strengths and weaknesses\n" \
           "- Suggested experiments\n" \
           "- Publication decision\n\n" \
           "What specific aspect would you like to know more about?"
