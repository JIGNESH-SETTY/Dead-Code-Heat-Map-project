export const demoData = (() => {
  const files = [];
  let totalFunctions = 0;
  let deadFunctions = 0;

  for (let i = 0; i < 30; i++) {
    const numFuncs = Math.floor(Math.random() * 10) + 2;
    const functions = [];
    let fileSum = 0;

    for (let j = 0; j < numFuncs; j++) {
      const isCalled = Math.random() > 0.3;
      const daysSinceTouch = Math.floor(Math.random() * 1000);
      let baseScore = Math.min(100, (daysSinceTouch / 1095) * 100);
      if (!isCalled) baseScore += 20;
      
      const deadScore = Math.max(0, Math.min(100, Math.round(baseScore)));
      if (deadScore > 60) deadFunctions++;
      fileSum += deadScore;

      functions.push({
        name: `func_${i}_${j}`,
        line: j * 10 + 5,
        lastModified: new Date(Date.now() - daysSinceTouch * 86400000).toISOString().split('T')[0],
        daysSinceTouch,
        isCalled,
        deadScore
      });
    }

    files.push({
      path: `src/module_${i}/component_${i}.js`,
      language: 'javascript',
      avgDeadScore: Math.round(fileSum / numFuncs),
      functions
    });
    totalFunctions += numFuncs;
  }

  return {
    summary: {
      totalFiles: 30,
      totalFunctions,
      deadFunctions,
      deadPercent: totalFunctions > 0 ? Number(((deadFunctions / totalFunctions) * 100).toFixed(1)) : 0,
      mostDeadFile: files.sort((a,b) => b.avgDeadScore - a.avgDeadScore)[0].path
    },
    files
  };
})();
