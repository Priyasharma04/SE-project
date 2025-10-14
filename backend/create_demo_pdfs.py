"""
Simple script to create sample PDF files for demo purposes.
Run this to generate the 3 demo PDF files.
"""

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
import os

def create_sample_pdf(filename, title, content):
    """Create a simple PDF file with title and content"""
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter
    
    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(1*inch, height - 1*inch, title)
    
    # Content
    c.setFont("Helvetica", 12)
    text_object = c.beginText(1*inch, height - 1.5*inch)
    
    # Split content into lines
    for line in content.split('\n'):
        text_object.textLine(line)
    
    c.drawText(text_object)
    c.save()
    print(f"✅ Created: {filename}")

# Create output directory
os.makedirs("demo_pdfs", exist_ok=True)

# 1. Machine Learning Paper
create_sample_pdf(
    "demo_pdfs/machine_learning_paper.pdf",
    "Machine Learning for Climate Prediction",
    """
Abstract:
This paper presents a novel deep learning approach for long-term climate 
prediction using transformer architectures. We demonstrate a 23% improvement 
over existing LSTM-based methods.

Introduction:
Climate prediction is a critical challenge for society. Traditional numerical 
weather prediction models are computationally expensive and have limited 
accuracy for long-term forecasts.

Methods:
We propose Climate-Former, a transformer-based architecture that processes 
multi-modal climate data including temperature, pressure, humidity, and 
satellite imagery.

Results:
Our model achieves state-of-the-art performance on the CMIP6 and ERA5 
benchmarks, with RMSE improvements of 23% over baseline methods.

Conclusion:
This work demonstrates the potential of transformer architectures for 
climate modeling and opens new directions for long-range weather prediction.
    """
)

# 2. Healthcare AI Paper
create_sample_pdf(
    "demo_pdfs/healthcare_ai.pdf",
    "AI-Driven Early Detection of Cardiovascular Disease",
    """
Abstract:
CardioAI is a multimodal deep learning system for early cardiovascular 
disease detection. Integrating ECG, imaging, and patient records, we achieve 
91.3% accuracy, a 12-15% improvement over single-modality approaches.

Introduction:
Cardiovascular disease (CVD) is the leading cause of mortality worldwide. 
Early detection can significantly improve patient outcomes and reduce 
healthcare costs.

Methods:
Our system uses a novel fusion architecture combining:
- ECG signal processing with 1D CNNs
- Cardiac CT/MRI analysis with 3D ResNets
- Electronic health record embedding with transformers

Results:
Validated on 45,000+ patients across 3 hospitals, achieving:
- 91.3% overall accuracy
- 89.7% sensitivity
- 93.1% specificity
- AUC-ROC of 0.957

Discussion:
While promising, we identified performance disparities across demographic 
groups. The model shows 18% lower accuracy for underrepresented populations, 
highlighting the need for more diverse training data.

Conclusion:
CardioAI demonstrates strong potential for clinical deployment, but fairness 
and bias mitigation remain critical challenges.
    """
)

# 3. Quantum Computing Paper
create_sample_pdf(
    "demo_pdfs/quantum_computing.pdf",
    "Quantum Algorithms for Drug Discovery Optimization",
    """
Abstract:
QuMolOpt introduces a variational quantum algorithm for molecular property 
prediction and drug screening. Using 53-qubit processors, we demonstrate 
10x speedup on specific quantum-friendly simulation tasks.

Introduction:
Drug discovery requires extensive molecular simulation, which is 
computationally expensive. Quantum computers promise exponential speedups 
for certain quantum chemistry problems.

Methods:
Our variational quantum eigensolver (VQE) approach:
- Encodes molecular structure in qubit states
- Uses parameterized quantum circuits for energy estimation
- Employs classical optimization for parameter updates

Experiments:
Tested on IBM and Google quantum processors with:
- 20-30 atom molecules
- Pharmaceutical drug candidates
- Comparison to DFT baseline methods

Results:
Achieved 10x speedup on quantum-friendly problems, though with significant 
noise-related challenges on current NISQ hardware.

Discussion:
While results are promising, scalability to drug-sized molecules (50-100 atoms) 
remains unclear. Error mitigation strategies are essential for practical use.

Conclusion:
Quantum computing shows potential for drug discovery, but hardware limitations 
must be addressed for real-world impact.
    """
)

print("\n✨ Demo PDF files created successfully in 'demo_pdfs' folder!")
print("\nYou can now use these files to test the demo system:")
print("1. machine_learning_paper.pdf")
print("2. healthcare_ai.pdf")
print("3. quantum_computing.pdf")
print("\nJust upload any of these files and the system will return instant reviews!")
