const { execSync } = require('child_process');

try {
  console.log("=== STEP 1: Git Add ===");
  console.log(execSync('git add .', { cwd: 'c:\\Users\\HP\\DJETFACTURE' }).toString());

  console.log("=== STEP 2: Git Commit ===");
  console.log(execSync('git commit -m "fix: repair JSX syntax in RecentInvoicesTable.tsx for Vercel build"', { cwd: 'c:\\Users\\HP\\DJETFACTURE' }).toString());

  console.log("=== STEP 3: Git Push ===");
  console.log(execSync('git push -u origin main', { cwd: 'c:\\Users\\HP\\DJETFACTURE' }).toString());

  console.log("=== SUCCESS ===");
} catch (e) {
  console.error("Error:", e.message, e.stdout?.toString(), e.stderr?.toString());
}
