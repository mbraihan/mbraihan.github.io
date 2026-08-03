---
title: "Implementing Gaze Dwell Selection in Unity"
date: "Feb 25, 2025"
category: "Technical"
tags: ["Unity", "C#", "Gaze Tracking"]
excerpt: "A quick note on how I implemented a robust gaze dwell selection system for our experiments."
image: "/assets/img/1.jpg"
readingTime: "4 min read"
pinned: false
order: 6
---

## Code Implementation

```csharp
public class GazeSelector : MonoBehaviour
{
    public LayerMask targetLayer;
    public float maxDistance = 10f;
    public float dwellTime = 0.5f;
    private float dwellTimer = 0f;

    void Update()
    {
        // Gaze raycast logic
    }
}
```
