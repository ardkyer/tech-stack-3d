import React, { useEffect, useRef } from 'react';
import ForceGraph from 'force-graph';

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const data = {
      nodes: [
        { id: "Me", group: 0, size: 25 },
        { id: "Frontend", group: 1, size: 20 },
        { id: "HTML", group: 1, size: 15 },
        { id: "CSS", group: 1, size: 15 },
        { id: "JavaScript", group: 1, size: 15 },
        { id: "Backend", group: 2, size: 20 },
        { id: "Java", group: 2, size: 15 },
        { id: "Python", group: 2, size: 15 },
        { id: "Database", group: 3, size: 20 },
        { id: "Oracle", group: 3, size: 15 },
        { id: "MySQL", group: 3, size: 15 },
        { id: "Tools", group: 4, size: 20 },
        { id: "IntelliJ", group: 4, size: 15 },
        { id: "VSCode", group: 4, size: 15 },
        { id: "Eclipse", group: 4, size: 15 },
        { id: "Anaconda", group: 4, size: 15 },
        { id: "Framework", group: 5, size: 20 },
        { id: "Spring", group: 5, size: 15 },
        { id: "SpringBoot", group: 5, size: 15 },
        { id: "Version Control", group: 6, size: 20 },
        { id: "Git", group: 6, size: 15 },
        { id: "GitHub", group: 6, size: 15 },
        { id: "AI", group: 7, size: 20 },
        { id: "PyTorch", group: 7, size: 15 },
        { id: "TensorFlow", group: 7, size: 15 }
      ],
      links: [
        { source: "Me", target: "Frontend" },
        { source: "Me", target: "Backend" },
        { source: "Me", target: "Database" },
        { source: "Me", target: "Tools" },
        { source: "Me", target: "Framework" },
        { source: "Me", target: "Version Control" },
        { source: "Me", target: "AI" },
        { source: "Frontend", target: "HTML" },
        { source: "Frontend", target: "CSS" },
        { source: "Frontend", target: "JavaScript" },
        { source: "Backend", target: "Java" },
        { source: "Backend", target: "Python" },
        { source: "Database", target: "Oracle" },
        { source: "Database", target: "MySQL" },
        { source: "Tools", target: "IntelliJ" },
        { source: "Tools", target: "VSCode" },
        { source: "Tools", target: "Eclipse" },
        { source: "Tools", target: "Anaconda" },
        { source: "Framework", target: "Spring" },
        { source: "Framework", target: "SpringBoot" },
        { source: "Version Control", target: "Git" },
        { source: "Version Control", target: "GitHub" },
        { source: "AI", target: "PyTorch" },
        { source: "AI", target: "TensorFlow" }
      ]
    };

    const Graph = ForceGraph()(containerRef.current)
      .graphData(data)
      .nodeColor(node => {
        const colors = [
          '#FFE87C', '#4FC3F7', '#7E57C2', '#26A69A',
          '#FF7043', '#66BB6A', '#42A5F5', '#EC407A'
        ];
        return node.id === "Me" ? '#FFD700' : colors[node.group];
      })

      .nodeCanvasObject((node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = (node.id === "Me" ? 18 : 14) / globalScale;
        ctx.font = `bold ${fontSize}px Arial`;

        const nodeSize = node.id === "Me" ? node.size : node.size / 1.5;

        // 우주적인 그라데이션 효과
        // NaN 체크 추가
        if (!isNaN(node.x) && !isNaN(node.y)) {
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, nodeSize
          );

          const baseColor = node.id === "Me" ? '#FFD700' : Graph.nodeColor()(node);
          gradient.addColorStop(0, baseColor);
          gradient.addColorStop(0.5, baseColor + '99');
          gradient.addColorStop(1, baseColor + '33');

          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = node.id === "Me" ? '#FFD700' : Graph.nodeColor()(node);
        }

        // 더 강한 글로우 효과
        const baseColor = node.id === "Me" ? '#FFD700' : Graph.nodeColor()(node);
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = node.id === "Me" ? 30 : 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 노드 그리기
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
        ctx.fill();

        // 빛나는 테두리
        ctx.strokeStyle = baseColor + 'CC';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 텍스트 효과
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(label, node.x, node.y);

        ctx.fillStyle = 'white';
        ctx.fillText(label, node.x, node.y);
      })

      .linkWidth(2)
      .linkColor(() => 'rgba(255,255,255,0.3)')
      .cooldownTicks(100)
      .nodeRelSize(8)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleSpeed(0.005)
      .linkDirectionalParticleWidth(2)
      .backgroundColor('#000000')
      .width(window.innerWidth)
      .height(window.innerHeight);

    Graph.d3Force('charge')
      .strength(-150)  // 반발력 약화
      .distanceMax(300);  // 반발 거리 증가

    Graph.d3Force('link')
      .distance(100)  // 링크 길이 증가
      .strength(0.2);  // 링크 강도 약화

    Graph.d3Force('center')
      .strength(0.01);  // 중심으로 향하는 힘 대폭 약화

    // 드래그 끝났을 때 고정 해제
    Graph.onNodeDragEnd(node => {
      node.fx = null;
      node.fy = null;
    });

    // 클릭 영역 확장
    Graph.nodePointerAreaPaint((node, color, ctx) => {
      const size = node.id === "Me" ? node.size : node.size / 1.5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 10, 0, 2 * Math.PI);
      ctx.fill();
    });

    return () => Graph._destructor();
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default App;