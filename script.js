// Initialize votes
let votes = { A: 0, B: 0, C: 0 };
let hasVoted = false;

// Check if user is logged in
window.onload = function() {
  const email = localStorage.getItem('voterEmail');
  const voted = localStorage.getItem('hasVoted');
  
  if (email && voted === 'true') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('votingArea').style.display = 'block';
    alert('You have already voted!');
    hasVoted = true;
  }
};

// Login function
function login() {
  const email = document.getElementById('emailInput').value;
  
  if (!email || !email.includes('@')) {
    document.getElementById('loginError').textContent = 'Please enter a valid email';
    return;
  }
  
  // Check if this email has already voted
  const votedEmails = JSON.parse(localStorage.getItem('votedEmails') || '[]');
  
  if (votedEmails.includes(email)) {
    document.getElementById('loginError').textContent = 'This email has already voted!';
    return;
  }
  
  // Store email and show voting area
  localStorage.setItem('voterEmail', email);
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('votingArea').style.display = 'block';
}

// Chart setup
const ctx = document.getElementById('resultsChart').getContext('2d');
const resultsChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Candidate A', 'Candidate B', 'Candidate C'],
    datasets: [{
      label: 'Number of Votes',
      data: [0, 0, 0],
      backgroundColor: ['rgba(76, 175, 80, 0.7)', 'rgba(33, 150, 243, 0.7)', 'rgba(255, 87, 34, 0.7)'],
      borderColor: ['#388E3C', '#1976D2', '#E64A19'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});

// Vote function with authentication check
function vote(candidate) {
  const email = localStorage.getItem('voterEmail');
  
  if (!email) {
    alert('Please login first!');
    return;
  }
  
  if (hasVoted || localStorage.getItem('hasVoted') === 'true') {
    alert('You have already voted!');
    return;
  }
  
  // Record the vote
  votes[candidate]++;
  
  // Mark as voted
  hasVoted = true;
  localStorage.setItem('hasVoted', 'true');
  
  // Add email to voted list
  const votedEmails = JSON.parse(localStorage.getItem('votedEmails') || '[]');
  votedEmails.push(email);
  localStorage.setItem('votedEmails', JSON.stringify(votedEmails));
  
  updateChart();
  updateTotal();
  
  alert('Vote submitted successfully!');
}

function updateTotal() {
  const total = votes.A + votes.B + votes.C;
  document.getElementById('totalVotes').textContent = total;
}

function updateChart() {
  resultsChart.data.datasets[0].data = [votes.A, votes.B, votes.C];
  resultsChart.update();
}
