"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, BookOpen, Clock, Cpu, Users, Shield, AlertTriangle } from "lucide-react"

interface QAItem {
  id: number
  question: string
  answer: string
  category: string
  chapter: string
  difficulty: "Basic" | "Intermediate" | "Advanced"
}

const qaData: QAItem[] = [
  // Chapter 5: Process Scheduling (keeping existing 42 questions)
  {
    id: 1,
    question: "What is process scheduling and why is it important in operating systems?",
    answer:
      "Process scheduling is the activity that handles the removal of the running process from the CPU and the selection of another process in the ready queue to allocate it to the CPU based on particular criteria. It's important because: 1) It maximizes CPU utilization, 2) Enables multiprogramming, 3) Makes the computer more productive by switching CPU among processes, 4) Ensures fair resource allocation among processes.",
    category: "Basic Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 2,
    question: "Explain the CPU-I/O Burst Cycle with an example.",
    answer:
      "Process execution consists of a cycle of CPU execution and I/O wait. Process execution begins with a CPU burst, followed by an I/O burst, then another CPU burst, and so on. Eventually, the final CPU burst ends with a system request to terminate execution. Example: A text editor process might have CPU burst (processing keystrokes), I/O burst (saving file to disk), CPU burst (updating display), I/O burst (reading from disk), and finally termination.",
    category: "Basic Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 3,
    question: "What is the role of CPU scheduler and when does it make scheduling decisions?",
    answer:
      "The CPU scheduler selects from among the processes in memory that are ready to execute and allocates the CPU to one of them. CPU scheduling decisions occur when a process: 1) Switches from running to waiting state (e.g., I/O request), 2) Switches from running to ready state (e.g., interrupt), 3) Switches from waiting to ready (e.g., I/O completion), 4) Terminates (process finishes execution).",
    category: "Basic Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 4,
    question: "Differentiate between preemptive and non-preemptive scheduling with examples.",
    answer:
      "Non-preemptive: Once CPU is allocated to a process, it keeps the CPU until it releases it by terminating or switching to waiting state. Examples: FCFS, SJF (non-preemptive version). Preemptive: CPU can be taken away from a currently running process and given to another process. Examples: Round Robin, Priority Scheduling (preemptive version), SJF (preemptive version). Preemptive scheduling allows better response time but incurs overhead due to context switching.",
    category: "Basic Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 5,
    question: "What problems can arise with preemptive scheduling?",
    answer:
      "Preemptive scheduling incurs costs associated with access to shared data. If two processes share data and one is updating the data when preempted, the second process might read inconsistent data. This requires new mechanisms to coordinate access to shared data (covered in Process Synchronization). Additionally, preemptive scheduling has higher overhead due to frequent context switching.",
    category: "Basic Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 6,
    question: "List and explain all five scheduling criteria used to compare CPU scheduling algorithms.",
    answer:
      "1) CPU Utilization: Keep CPU as busy as possible (maximize), 2) Throughput: Number of processes completing execution per time unit (maximize), 3) Turnaround Time: Interval from process submission to completion, includes waiting in memory, ready queue, executing, and I/O (minimize), 4) Waiting Time: Amount of time spent waiting in ready queue (minimize), 5) Response Time: Time from request submission until first response is produced (minimize).",
    category: "Scheduling Criteria",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 7,
    question: "What is the difference between turnaround time, waiting time, and response time?",
    answer:
      "Turnaround Time = Completion Time - Arrival Time (total time in system). Waiting Time = Turnaround Time - Burst Time (time spent waiting in ready queue only). Response Time = Time until first response - Arrival Time (important for interactive systems). Example: If a process arrives at 0, starts at 5, and completes at 15 with burst time 8, then Turnaround=15, Waiting=7, Response=5.",
    category: "Scheduling Criteria",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 8,
    question: "What are the optimization goals for scheduling criteria?",
    answer:
      "Maximize: CPU utilization and throughput. Minimize: turnaround time, waiting time, and response time. These goals sometimes conflict - for example, minimizing response time might reduce throughput. The choice depends on system requirements (interactive vs batch systems).",
    category: "Scheduling Criteria",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 9,
    question: "Explain FCFS scheduling algorithm with its advantages and disadvantages.",
    answer:
      "FCFS (First-Come, First-Served) queues processes in arrival order. Advantages: Simple and easy to implement. Disadvantages: 1) Non-preemptive nature can cause starvation, 2) Poor performance with high average waiting time, 3) Convoy effect where short processes wait for long processes, 4) CPU and device utilization may be lower than optimal.",
    category: "FCFS",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 10,
    question: "What is convoy effect in FCFS scheduling? Provide an example.",
    answer:
      "Convoy effect occurs when short processes wait behind a long process, like cars behind a slow truck. Example: If P1(24ms), P2(3ms), P3(3ms) arrive in order, P2 and P3 wait 24ms and 27ms respectively. If they arrived as P2, P3, P1, waiting times would be 0ms, 3ms, 6ms respectively - much better performance.",
    category: "FCFS",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 11,
    question: "How do you calculate waiting time and turnaround time in FCFS?",
    answer:
      "Waiting Time: wt[0] = 0 (first process), wt[i] = bt[i-1] + wt[i-1] for others. Turnaround Time: tat[i] = bt[i] + wt[i]. With arrival times: wt[i] = bt[i-1] + wt[i-1] + at[i-1] - at[i]. Average times = sum of individual times / number of processes.",
    category: "FCFS",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 12,
    question: "How does context switching overhead affect FCFS performance?",
    answer:
      "Context switching adds overhead time between process executions. If switching time is 1ms and we have processes P1(24ms), P2(3ms), P3(3ms), the waiting times become: P1=1ms, P2=26ms, P3=30ms instead of 0ms, 24ms, 27ms without overhead. This increases average waiting time from 17ms to 19ms, showing that context switching is always an overhead.",
    category: "FCFS",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 13,
    question: "Explain SJF scheduling algorithm and why it's considered optimal.",
    answer:
      "SJF (Shortest Job First) selects the waiting process with smallest execution time. It's optimal because it gives minimum average waiting time for a given set of processes. This is mathematically provable - any other arrangement would result in higher average waiting time. However, it's difficult to implement because exact burst times are unknown in advance.",
    category: "SJF",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 14,
    question: "What are the advantages and disadvantages of SJF scheduling?",
    answer:
      "Advantages: 1) Maximum throughput, 2) Minimum average waiting and turnaround time, 3) Optimal for average waiting time. Disadvantages: 1) May suffer from starvation (long processes may never execute), 2) Not implementable in practice because exact burst time cannot be known in advance, 3) Requires prediction mechanisms for burst time estimation.",
    category: "SJF",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 15,
    question: "Calculate average waiting time for SJF: P1(6ms), P2(8ms), P3(7ms), P4(3ms) arriving simultaneously.",
    answer:
      "SJF order: P4(3), P1(6), P3(7), P2(8). Gantt chart: P4(0-3), P1(3-9), P3(9-16), P2(16-24). Waiting times: P4=0, P1=3, P3=9, P2=16. Average waiting time = (0+3+9+16)/4 = 7ms. This is optimal - any other order gives higher average waiting time.",
    category: "SJF",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 16,
    question: "How do you handle SJF scheduling with different arrival times?",
    answer:
      "With different arrival times, select the shortest job among available processes at each decision point. Use formula: wt[i] = start_time[i] - arrival_time[i]. The algorithm becomes more complex as you must consider which processes have arrived when making scheduling decisions. This may not always give globally optimal results.",
    category: "SJF",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 17,
    question: "Explain Priority Scheduling and its relationship with SJF.",
    answer:
      "Priority Scheduling assigns a priority number to each process and allocates CPU to the highest priority process. It can be preemptive or non-preemptive. SJF is actually a special case of priority scheduling where priority is the predicted next CPU burst time (shorter burst = higher priority). Priorities can be based on memory requirements, time requirements, or other resource needs.",
    category: "Priority",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 18,
    question: "What is the starvation problem in Priority Scheduling and how is it solved?",
    answer:
      "Starvation occurs when low-priority processes wait indefinitely because high-priority processes keep arriving. Solution is Aging - gradually increasing the priority of processes that wait in the system for a long time. Example: If priorities range from 127 (low) to 0 (high), increase priority by 1 every 15 minutes. Eventually, even priority 127 processes will reach priority 0.",
    category: "Priority",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 19,
    question:
      "Calculate average waiting time for Priority Scheduling: P1(10ms,3), P2(1ms,1), P3(2ms,4), P4(1ms,5), P5(5ms,2).",
    answer:
      "Order by priority (1=highest): P2(1), P5(2), P1(3), P3(4), P4(5). Gantt: P2(0-1), P5(1-6), P1(6-16), P3(16-18), P4(18-19). Waiting times: P2=0, P5=1, P1=6, P3=16, P4=18. Average = (0+1+6+16+18)/5 = 8.2ms.",
    category: "Priority",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 20,
    question: "Explain Round Robin scheduling algorithm and its key characteristics.",
    answer:
      "Round Robin is designed for timesharing systems. Each process gets a small time quantum (10-100ms), then is preempted and moved to end of ready queue. Key characteristics: 1) Preemptive, 2) Fair sharing, 3) No starvation, 4) Ready queue treated as circular queue, 5) Performance depends heavily on time quantum size.",
    category: "Round Robin",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Basic",
  },
  {
    id: 21,
    question: "What are the advantages and disadvantages of Round Robin scheduling?",
    answer:
      "Advantages: 1) Fairness - every process gets equal CPU share, 2) No starvation, 3) Good response time for interactive systems. Disadvantages: 1) High context switching overhead, 2) Larger waiting time and turnaround time compared to SJF, 3) Low throughput, 4) Time consuming for small quantum, 5) CPU may be idle due to frequent context switches.",
    category: "Round Robin",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 22,
    question: "How does time quantum size affect Round Robin performance?",
    answer:
      "If time quantum is extremely large, RR becomes FCFS. If extremely small (1ms), it becomes processor sharing where each process appears to have its own processor running at 1/n speed. Optimal quantum balances response time and overhead. Small quantum gives better response but higher overhead; large quantum reduces overhead but may increase response time.",
    category: "Round Robin",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 23,
    question: "Calculate average waiting time for RR with quantum=4: P1(24ms), P2(3ms), P3(3ms).",
    answer:
      "Gantt chart: P1(0-4), P2(4-7), P3(7-10), P1(10-14), P1(14-18), P1(18-22), P1(22-26), P1(26-30). Completion times: P2=7, P3=10, P1=30. Waiting times: P2=4, P3=7, P1=6. Average waiting time = (4+7+6)/3 = 5.67ms. Turnaround times: P2=7, P3=10, P1=30. Average = 15.67ms.",
    category: "Round Robin",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 24,
    question: "What is the maximum waiting time for a process in Round Robin?",
    answer:
      "If there are n processes in the ready queue and time quantum is q, each process gets 1/n of CPU time in chunks of at most q time units. Each process must wait no longer than (n-1) × q time units until its next time quantum. This guarantees bounded waiting time.",
    category: "Round Robin",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 25,
    question: "Explain Multilevel Queue Scheduling and when it's used.",
    answer:
      "Used when processes can be divided into different classes with different scheduling needs. Ready queue is partitioned into separate queues (e.g., foreground/interactive, background/batch). Processes are permanently assigned to queues based on properties like memory size, priority, or type. Each queue has its own scheduling algorithm (e.g., foreground uses RR, background uses FCFS).",
    category: "Multilevel Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 26,
    question: "What are the two main approaches for scheduling between queues in Multilevel Queue?",
    answer:
      "1) Fixed Priority Scheduling: Higher priority queue has absolute priority over lower priority queues. Serve all processes from foreground before background. Risk of starvation for lower priority queues. 2) Time Slice: Each queue gets certain amount of CPU time to schedule among its processes (e.g., 80% to foreground in RR, 20% to background in FCFS).",
    category: "Multilevel Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 27,
    question: "What are the advantages and disadvantages of Multilevel Queue Scheduling?",
    answer:
      "Advantages: Low scheduling overhead, different algorithms for different process types. Disadvantages: 1) Starvation possible if higher priority queues never become empty, 2) Inflexible since processes cannot change their queue assignment, 3) Fixed classification may not reflect changing process behavior.",
    category: "Multilevel Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 28,
    question: "How does Multilevel Feedback Queue differ from Multilevel Queue?",
    answer:
      "MLFQ allows processes to move between queues based on their CPU burst characteristics, while MLQ has permanent queue assignment. MLFQ is more flexible and can adapt to changing process behavior. It prevents starvation through aging - processes waiting too long in lower-priority queues are moved to higher-priority queues.",
    category: "Multilevel Feedback Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 29,
    question: "What parameters define a Multilevel Feedback Queue scheduler?",
    answer:
      "1) Number of queues, 2) Scheduling algorithm for each queue, 3) Method to determine when to upgrade a process to higher priority queue, 4) Method to determine when to demote a process to lower priority queue, 5) Method to determine which queue a process enters when it needs service initially.",
    category: "Multilevel Feedback Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 30,
    question: "Explain the example MLFQ with three queues: Q0(RR,8ms), Q1(RR,16ms), Q2(FCFS).",
    answer:
      "New jobs enter Q0 (RR with 8ms quantum). If job doesn't finish in 8ms, it moves to Q1 (RR with 16ms quantum). If still not complete after 16ms, it moves to Q2 (FCFS). Scheduling between queues is FCFS - higher priority queues are served first. This favors short processes while ensuring long processes eventually complete.",
    category: "Multilevel Feedback Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 31,
    question: "What are the advantages and disadvantages of MLFQ?",
    answer:
      "Advantages: 1) Flexible - processes can move between queues, 2) Prevents starvation through aging, 3) Adapts to process behavior changes. Disadvantages: 1) Requires careful parameter selection, 2) Higher CPU overhead due to complexity, 3) Most complex algorithm to design and implement, 4) May require tuning for specific workloads.",
    category: "Multilevel Feedback Queue",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 32,
    question: "What makes CPU scheduling more complex in multiprocessor systems?",
    answer:
      "Multiple CPUs require coordination and load balancing. Issues include: 1) How to distribute processes among processors, 2) Maintaining cache coherency, 3) Processor affinity considerations, 4) Load balancing vs. cache performance trade-offs, 5) Synchronization overhead for shared data structures.",
    category: "Multi-Processor",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 33,
    question: "Differentiate between Asymmetric and Symmetric Multiprocessing.",
    answer:
      "Asymmetric Multiprocessing (AMP): Only one processor accesses system data structures, reducing need for data sharing but creating potential bottleneck. Symmetric Multiprocessing (SMP): Each processor is self-scheduling with either common ready queue or private queues per processor. SMP is more complex but offers better performance and fault tolerance.",
    category: "Multi-Processor",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 34,
    question: "Explain processor affinity and its types.",
    answer:
      "Processor affinity means a process has preference for the processor it's currently running on (due to cache contents). Soft affinity: Process can migrate between processors but OS tries to keep it on same processor. Hard affinity: Process is explicitly bound to specific processors and cannot migrate. Affinity improves cache performance but may cause load imbalance.",
    category: "Multi-Processor",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 35,
    question: "What are the advantages of multicore processors over multiple single-core processors?",
    answer:
      "Multicore processors: 1) Faster communication between cores, 2) Consume less power than multiple separate processors, 3) Better cache sharing possibilities, 4) Lower manufacturing costs, 5) Support for multiple threads per core, 6) Reduced system complexity compared to multiple physical processors.",
    category: "Multi-Processor",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 36,
    question: "What factors should be considered when selecting a CPU scheduling algorithm?",
    answer:
      "1) Define criteria importance (response time vs throughput), 2) System type (interactive vs batch), 3) Process characteristics (CPU-bound vs I/O-bound), 4) Performance constraints (maximum response time), 5) Fairness requirements, 6) Implementation complexity, 7) Overhead costs, 8) Scalability needs.",
    category: "Algorithm Evaluation",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 37,
    question: "Explain deterministic modeling for algorithm evaluation.",
    answer:
      "Deterministic modeling (analytic evaluation) takes a predetermined workload and defines performance of each algorithm for that workload. Advantages: Simple, fast, gives exact numbers for comparison. Disadvantages: Requires exact input numbers, answers apply only to specific cases, may not represent real workloads, doesn't account for variability.",
    category: "Algorithm Evaluation",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Intermediate",
  },
  {
    id: 38,
    question: "What are queueing models and how are they used in algorithm evaluation?",
    answer:
      "Queueing models are mathematical models that help manage and optimize process scheduling, resource allocation, and I/O handling. Given arrival rates and service rates, they can compute utilization, average queue length, average wait time, etc. They provide theoretical analysis but require assumptions about arrival patterns and service distributions.",
    category: "Algorithm Evaluation",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 39,
    question: "Compare FCFS, SJF, Priority, and Round Robin algorithms in terms of performance characteristics.",
    answer:
      "FCFS: Simple but poor average waiting time, convoy effect. SJF: Optimal average waiting time but starvation possible, not practical. Priority: Flexible but starvation risk, requires aging. Round Robin: Fair, good response time, but higher overhead and average waiting time. Choice depends on system requirements: interactive systems prefer RR, batch systems might use SJF or Priority.",
    category: "Algorithm Evaluation",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 40,
    question: "How would you design a scheduling algorithm for a real-time system?",
    answer:
      "Real-time scheduling requires: 1) Deadline-aware algorithms (EDF - Earliest Deadline First), 2) Priority inheritance to avoid priority inversion, 3) Predictable execution times, 4) Preemptive scheduling for urgent tasks, 5) Resource reservation mechanisms, 6) Minimal scheduling overhead, 7) Support for periodic and aperiodic tasks, 8) Admission control to ensure schedulability.",
    category: "Advanced Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 41,
    question: "What scheduling considerations are important for mobile and embedded systems?",
    answer:
      "Mobile/embedded scheduling considerations: 1) Power consumption (frequency scaling), 2) Battery life optimization, 3) Thermal management, 4) Limited memory and processing power, 5) Real-time constraints for multimedia, 6) Background task management, 7) User responsiveness, 8) Energy-efficient scheduling algorithms, 9) Wake-up minimization for idle periods.",
    category: "Advanced Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },
  {
    id: 42,
    question: "How do modern operating systems implement adaptive scheduling?",
    answer:
      "Modern adaptive scheduling: 1) Dynamic priority adjustment based on behavior, 2) Machine learning for burst time prediction, 3) Workload classification (interactive vs batch), 4) Feedback mechanisms to adjust parameters, 5) Multi-level feedback queues with automatic tuning, 6) Load balancing algorithms, 7) NUMA-aware scheduling, 8) Container and virtualization considerations.",
    category: "Advanced Concepts",
    chapter: "Chapter 5: Process Scheduling",
    difficulty: "Advanced",
  },

  // Chapter 8: Main Memory - Comprehensive Questions (43-120)
  {
    id: 43,
    question: "What is the role of main memory in computer systems and why is memory management important?",
    answer:
      "Main memory and registers are the only storage CPU can access directly. Register access takes one CPU clock cycle, while main memory can take many cycles. Cache sits between main memory and CPU registers. Memory management is crucial to: 1) Ensure correct operation, 2) Protect OS from user processes, 3) Protect user processes from each other, 4) Optimize memory utilization, 5) Enable multiprogramming.",
    category: "Main Memory Basics",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Basic",
  },
  {
    id: 44,
    question: "Explain the memory hierarchy and access times for different storage levels.",
    answer:
      "Memory hierarchy from fastest to slowest: 1) CPU Registers (1 clock cycle), 2) Cache Memory (1-10 cycles), 3) Main Memory (100-300 cycles), 4) Secondary Storage (millions of cycles). Each level trades off speed for capacity and cost. Cache acts as buffer between CPU and main memory to reduce average access time through locality of reference.",
    category: "Main Memory Basics",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 45,
    question: "What are the different types of memory protection and why are they necessary?",
    answer:
      "Memory protection types: 1) Base and Limit registers - define legal address range, 2) Segmentation - logical protection boundaries, 3) Paging - page-level protection bits, 4) Virtual memory - process isolation. Necessary to: prevent processes from accessing OS memory, prevent processes from interfering with each other, detect illegal memory accesses, enable secure multiprogramming.",
    category: "Main Memory Basics",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 46,
    question: "Explain the three stages of address binding and when each occurs.",
    answer:
      "1) Compile time: If process location in memory is known at compile time, absolute code is generated. Fixed addresses. 2) Load time: If location unknown at compile time, compiler generates relocatable code. Final binding delayed until load time. 3) Execution time: Binding delayed until runtime if process can be moved during execution. Requires hardware support for address maps (MMU).",
    category: "Address Binding",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 47,
    question: "What are the advantages and disadvantages of each address binding method?",
    answer:
      "Compile-time: Advantages - fastest execution, no runtime overhead. Disadvantages - inflexible, must know memory location in advance. Load-time: Advantages - more flexible than compile-time. Disadvantages - binding overhead at load time, cannot move process. Execution-time: Advantages - maximum flexibility, can move processes. Disadvantages - runtime overhead for address translation, requires MMU hardware.",
    category: "Address Binding",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 48,
    question: "Differentiate between logical and physical addresses with examples.",
    answer:
      "Logical Address: Generated by CPU, also called virtual address. Used as reference to access physical memory. Physical Address: Address seen by memory unit, loaded into memory-address register. In compile-time and load-time binding, logical and physical addresses are same. In execution-time binding, they differ. Example: Logical address 346 might map to physical address 14346 if relocation register contains 14000.",
    category: "Address Binding",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 49,
    question: "What is Memory Management Unit (MMU) and how does it work?",
    answer:
      "MMU is hardware device that maps logical to physical addresses at execution time. In MMU scheme, relocation register value is added to every address generated by user process when sent to memory. User program deals with logical addresses only, never sees real physical addresses. This enables dynamic relocation and memory protection.",
    category: "Address Binding",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 50,
    question: "Explain the concept of relocation register and its role in address translation.",
    answer:
      "Relocation register contains base address of process in physical memory. During address translation, MMU adds relocation register value to logical address to get physical address. Formula: Physical Address = Logical Address + Relocation Register. This allows processes to be loaded anywhere in memory and enables dynamic relocation during execution.",
    category: "Address Binding",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 51,
    question: "What is dynamic loading and how does it differ from static loading?",
    answer:
      "Dynamic Loading: Routines not loaded until called. All routines kept on disk in relocatable format. Main program loaded first. Static Loading: All routines loaded into memory before execution begins. Dynamic advantages: 1) Better memory utilization, 2) Unused routines never loaded, 3) Useful for infrequent code, 4) Faster startup. Static advantages: 1) Simpler implementation, 2) No loading overhead during execution.",
    category: "Dynamic Loading",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Basic",
  },
  {
    id: 52,
    question: "Explain dynamic linking and its advantages over static linking.",
    answer:
      "Dynamic Linking: Linking postponed until execution time. Stub used to locate library routine. Library code shared among processes. Static Linking: All library code included in executable. Dynamic advantages: 1) Smaller executable files, 2) Library updates benefit all programs, 3) Memory sharing reduces total memory usage, 4) Version compatibility. Disadvantages: 1) Runtime overhead, 2) Dependency management complexity.",
    category: "Dynamic Loading",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 53,
    question: "What is swapping and when is it used? Explain roll out, roll in.",
    answer:
      "Swapping: Process temporarily moved out of main memory to secondary storage (backing store), making memory available to other processes. Later brought back for continued execution. Roll out, roll in: Swapping variant for priority-based scheduling. Lower-priority process swapped out so higher-priority process can be loaded and executed. System maintains ready queue of processes with memory images on disk.",
    category: "Swapping",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 54,
    question: "What are the requirements and constraints for effective swapping?",
    answer:
      "Requirements: 1) Fast backing store (disk) with direct access, 2) Sufficient disk space for all memory images, 3) Modified pages must be written to disk. Constraints: 1) Process must be completely idle when swapped, 2) I/O operations must complete before swapping, 3) Swapping time proportional to memory size, 4) Context switching overhead increases. Not suitable for real-time systems due to unpredictable delays.",
    category: "Swapping",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 55,
    question: "Calculate swapping time: Process size 10MB, transfer rate 50MB/s, seek time 8ms.",
    answer:
      "Swapping time = Seek time + Transfer time. Transfer time = Process size / Transfer rate = 10MB / 50MB/s = 0.2s = 200ms. Total swap-out time = 8ms + 200ms = 208ms. Total swap-in time = 8ms + 200ms = 208ms. Complete swap cycle = 208ms + 208ms = 416ms. This shows swapping can be expensive for large processes.",
    category: "Swapping",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 56,
    question: "Explain contiguous memory allocation and the concept of holes.",
    answer:
      "Contiguous memory allocation: Each process contained in single contiguous memory section. Main memory divided into: 1) Resident OS (low memory with interrupt vector), 2) User processes (high memory). Hole: Block of available memory. Holes of various sizes scattered throughout memory. When process arrives, allocated memory from hole large enough to accommodate it.",
    category: "Contiguous Allocation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Basic",
  },
  {
    id: 57,
    question: "What is multiple-partition allocation and how does the OS manage it?",
    answer:
      "Multiple-partition allocation divides memory into several fixed or variable partitions. OS maintains information about: 1) Allocated partitions (which process, size, location), 2) Free partitions/holes (size, location). Data structures used: partition table, free list, or bitmap. When process terminates, its partition becomes available hole. Adjacent holes may be merged to create larger holes.",
    category: "Contiguous Allocation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 58,
    question: "Compare First-fit, Best-fit, and Worst-fit allocation strategies with examples.",
    answer:
      "Example: Holes of sizes 100K, 500K, 200K, 300K, 600K. Request for 212K. First-fit: Allocate first hole ≥ 212K → 500K hole (fast, leaves 288K). Best-fit: Allocate smallest hole ≥ 212K → 300K hole (leaves 88K, smallest waste). Worst-fit: Allocate largest hole → 600K hole (leaves 388K, largest remaining). Performance: First-fit and best-fit better than worst-fit. First-fit generally faster.",
    category: "Contiguous Allocation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 59,
    question: "What is the 50-percent rule in dynamic storage allocation?",
    answer:
      "The 50-percent rule states that given N allocated blocks, another 0.5N blocks will be lost to fragmentation. This means that one-third of memory may be unusable due to fragmentation. This rule applies to first-fit allocation and helps estimate memory waste. It demonstrates why contiguous allocation may not be efficient for systems with varying process sizes.",
    category: "Contiguous Allocation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 60,
    question: "What are external and internal fragmentation? Provide examples and solutions.",
    answer:
      "External Fragmentation: Total memory space exists to satisfy request but not contiguous. Example: 300K available in 100K, 50K, 150K holes but need 200K contiguous. Internal Fragmentation: Allocated memory larger than requested. Example: Process needs 18.5K but gets 20K block, 1.5K wasted. Solutions: External - compaction, paging, segmentation. Internal - smaller block sizes, variable partitions.",
    category: "Fragmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 61,
    question: "Explain memory compaction and its requirements.",
    answer:
      "Compaction: Shuffle memory contents to place all free memory together in one large block. Requirements: 1) Dynamic relocation capability (execution-time binding), 2) All processes must be stopped during compaction, 3) Update all pointers and addresses. Cost: Proportional to total memory size. Alternative: Partial compaction - move only some processes. Used when external fragmentation becomes severe.",
    category: "Fragmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 62,
    question: "How does compaction time affect system performance?",
    answer:
      "Compaction time depends on: 1) Total memory size, 2) Number of processes to move, 3) Memory transfer rate. Example: 1GB memory, 50MB/s transfer rate = 20 seconds compaction time. During compaction: all processes stopped, no useful work done, system appears frozen. Frequency affects performance: too often wastes time, too seldom causes fragmentation. Modern systems avoid compaction by using paging/segmentation.",
    category: "Fragmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 63,
    question: "Explain paging memory management scheme and its key components.",
    answer:
      "Paging: Memory-management scheme permitting physical address space to be noncontiguous. Key components: 1) Pages - fixed-size logical memory blocks, 2) Frames - fixed-size physical memory blocks, 3) Page table - maps pages to frames, 4) MMU - translates logical to physical addresses. Advantages: No external fragmentation, easy allocation, protection possible. Page size typically 4KB-8KB (power of 2).",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 64,
    question: "How does address translation work in paging? Provide a detailed example.",
    answer:
      "Logical address divided into: page number (p) and page offset (d). Physical address: frame number (f) + page offset (d). Example: 16-bit address space, 4KB pages. Address 8196 = binary 0010000000000100. Page number = 8196/4096 = 2, offset = 8196%4096 = 4. If page 2 maps to frame 5, physical address = 5*4096 + 4 = 20484. Page table lookup: page 2 → frame 5.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 65,
    question: "What is a page table and what information does it contain?",
    answer:
      "Page table: Data structure mapping logical pages to physical frames. Information per entry: 1) Frame number - where page is stored, 2) Valid bit - page in memory or not, 3) Protection bits - read/write/execute permissions, 4) Reference bit - page accessed recently, 5) Modify bit - page changed since loaded, 6) Caching bits - cache policy for page. One page table per process, stored in memory.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 66,
    question: "Explain the Translation Lookaside Buffer (TLB) and its importance.",
    answer:
      "TLB: High-speed associative memory cache for page table entries. Contains recently used page-to-frame translations. Operation: 1) Check TLB for page number, 2) If hit, get frame number directly, 3) If miss, access page table in memory, update TLB. Importance: Reduces effective memory access time from 2 memory accesses to ~1.2 accesses with 80% hit ratio. Critical for paging performance.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 67,
    question: "Calculate effective access time with TLB: TLB access 20ns, memory access 100ns, hit ratio 80%.",
    answer:
      "Effective Access Time = (Hit ratio × TLB access time) + (Miss ratio × (TLB access time + 2 × Memory access time)). EAT = (0.8 × 20) + (0.2 × (20 + 2 × 100)) = 16 + (0.2 × 220) = 16 + 44 = 60ns. Without TLB: 2 × 100 = 200ns. TLB provides 70% improvement in access time.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 68,
    question: "What are the different page table structures and their trade-offs?",
    answer:
      "1) Single-level: Simple but large for big address spaces. 2) Hierarchical (multi-level): Reduces memory usage, increases access time. 3) Hashed: Good for sparse address spaces, hash collisions possible. 4) Inverted: One entry per frame, saves space but slower lookups. Trade-offs: Memory usage vs access time vs complexity. Choice depends on address space size and access patterns.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 69,
    question: "Explain hierarchical page tables with a two-level example.",
    answer:
      "Two-level paging: Logical address divided into page directory index, page table index, and offset. Example: 32-bit address, 4KB pages, 4-byte entries. Page directory (1024 entries) points to page tables (1024 entries each). Address 0x12345678: Directory index = 0x123, Table index = 0x45, Offset = 0x678. Advantages: Reduces memory for sparse address spaces. Disadvantages: Extra memory access for translation.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 70,
    question: "What is an inverted page table and when is it used?",
    answer:
      "Inverted page table: One entry per physical frame instead of per logical page. Entry contains (process-id, page-number) of page stored in that frame. Used when: 1) Physical memory much smaller than virtual address space, 2) Memory conservation critical. Advantages: Fixed size regardless of process count. Disadvantages: Longer search time, need hash table for efficiency, shared pages difficult.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 71,
    question: "How does page sharing work and what are its benefits?",
    answer:
      "Page sharing: Multiple processes map same logical pages to same physical frames. Common for: 1) Shared libraries (libc, system DLLs), 2) Read-only code segments, 3) Shared memory regions. Implementation: Page tables of different processes point to same frames. Benefits: Reduced memory usage, faster process creation, consistent library updates. Challenges: Protection coordination, reference counting for deallocation.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 72,
    question: "What factors determine optimal page size?",
    answer:
      "Factors affecting page size: 1) Internal fragmentation (smaller pages better), 2) Page table size (larger pages better), 3) I/O time (larger pages better for disk), 4) Locality (depends on program behavior), 5) TLB coverage (larger pages better). Trade-off: Small pages reduce internal fragmentation but increase page table overhead. Typical sizes: 4KB-64KB. Trend toward larger pages due to growing memory sizes.",
    category: "Paging",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 73,
    question: "Explain segmentation memory management and how it differs from paging.",
    answer:
      "Segmentation: Memory-management scheme supporting user view of memory. Process divided into variable-size segments (logical units like functions, arrays, objects). Differences from paging: 1) Variable vs fixed size, 2) User-visible vs transparent, 3) Logical units vs arbitrary divisions, 4) May have external fragmentation vs no external fragmentation, 5) Segment table vs page table.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 74,
    question: "What information is stored in a segment table?",
    answer:
      "Segment table entry contains: 1) Base address - starting physical address of segment, 2) Limit - length of segment, 3) Protection bits - read/write/execute permissions, 4) Valid bit - segment in memory or not, 5) Growth direction - upward or downward growing, 6) Access rights - user/supervisor mode access. Each process has its own segment table stored in memory.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Intermediate",
  },
  {
    id: 75,
    question: "How does address translation work in segmentation?",
    answer:
      "Logical address: (segment number, offset). Translation: 1) Use segment number to index segment table, 2) Check if offset < limit (bounds checking), 3) If valid, physical address = base + offset, 4) If invalid, generate segmentation fault. Example: Address (2, 53) with segment 2 base=4300, limit=100. Physical address = 4300 + 53 = 4353. Protection violation if offset ≥ limit.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 76,
    question: "What are the advantages and disadvantages of segmentation?",
    answer:
      "Advantages: 1) Logical organization matches program structure, 2) Easy sharing of code/data segments, 3) Protection at logical level, 4) Dynamic growth of segments, 5) No internal fragmentation. Disadvantages: 1) External fragmentation, 2) Complex memory allocation, 3) Segment table overhead, 4) Difficult to implement efficiently, 5) Compaction may be needed.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 77,
    question: "Explain segmentation with paging and its benefits.",
    answer:
      "Segmentation with paging: Combine benefits of both schemes. Each segment divided into pages. Address: (segment, page, offset). Translation: 1) Segment table gives page table base, 2) Page table gives frame number, 3) Frame + offset = physical address. Benefits: 1) Logical organization of segmentation, 2) No external fragmentation from paging, 3) Efficient memory utilization, 4) Protection at segment level.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },
  {
    id: 78,
    question: "Compare paging vs segmentation vs combined approach.",
    answer:
      "Paging: Fixed size, transparent to user, no external fragmentation, simple allocation, internal fragmentation. Segmentation: Variable size, user-visible, external fragmentation, complex allocation, logical organization. Combined: Variable segment size with fixed page size, best of both worlds, more complex implementation, two-level translation overhead. Choice depends on system requirements and hardware support.",
    category: "Segmentation",
    chapter: "Chapter 8: Main Memory",
    difficulty: "Advanced",
  },

  // Chapter 6: Process Synchronization - Comprehensive Questions (79-160)
  {
    id: 79,
    question: "What is process synchronization and why is it necessary in concurrent systems?",
    answer:
      "Process synchronization means coordinating execution of concurrent processes that share resources or data. Necessary because: 1) Concurrent access to shared data may cause inconsistency, 2) Race conditions can produce incorrect results, 3) Processes may interfere with each other, 4) Need to maintain data integrity, 5) Ensure orderly execution of cooperating processes. Without synchronization, system behavior becomes unpredictable.",
    category: "Synchronization Basics",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Basic",
  },
  {
    id: 80,
    question: "Define race condition and provide a detailed example with code.",
    answer:
      "Race condition: Situation where multiple processes access shared data concurrently and outcome depends on execution order. Example: Two processes updating shared counter. Process A: temp = counter; temp = temp + 1; counter = temp. Process B: temp = counter; temp = temp - 1; counter = temp. If counter=5 initially, final value could be 4, 5, or 6 depending on interleaving. Correct result should be 5, but race condition can produce wrong values.",
    category: "Synchronization Basics",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 81,
    question: "Explain the producer-consumer problem and why synchronization is needed.",
    answer:
      "Producer-consumer problem: Producer generates data for shared buffer, consumer removes data. Issues without synchronization: 1) Producer may overwrite data before consumer reads, 2) Consumer may read same data twice, 3) Producer may add to full buffer, 4) Consumer may read from empty buffer, 5) Counter variable may be corrupted by race conditions. Need synchronization to coordinate access and maintain buffer state correctly.",
    category: "Synchronization Basics",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 82,
    question: "What is a critical section and what are the three requirements for a solution?",
    answer:
      "Critical Section: Code segment where process accesses shared resources (variables, files, etc.). Three requirements: 1) Mutual Exclusion: If process Pi executing in critical section, no other process can execute in their critical sections, 2) Progress: If no process in critical section and some want to enter, selection cannot be postponed indefinitely, 3) Bounded Waiting: Bound must exist on number of times other processes enter critical section after process requests entry.",
    category: "Critical Section",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 83,
    question: "Describe the general structure of a critical section solution.",
    answer:
      "General structure: do { entry section; critical section; exit section; remainder section; } while (true). Entry section: Code to request permission to enter critical section. Critical section: Code accessing shared resources. Exit section: Code to indicate leaving critical section. Remainder section: Other code not accessing shared resources. Solution must ensure mutual exclusion, progress, and bounded waiting.",
    category: "Critical Section",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Basic",
  },
  {
    id: 84,
    question: "Why don't simple solutions like turn variables work for multiple processes?",
    answer:
      "Simple turn variable problems: 1) Strict alternation - if one process doesn't want to enter, others blocked (violates progress), 2) Doesn't handle different execution speeds, 3) Process may be blocked in remainder section, 4) No bounded waiting guarantee, 5) Assumes processes alternate entry. Need more sophisticated mechanisms that allow processes to enter when critical section is free, regardless of other processes' states.",
    category: "Critical Section",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 85,
    question: "Explain Peterson's Solution in detail with pseudocode.",
    answer:
      "Peterson's Solution for two processes: Shared variables: boolean flag[2] = {false, false}; int turn = 0. Process Pi: flag[i] = true; turn = j; while (flag[j] && turn == j); // critical section; flag[i] = false. Process Pj: flag[j] = true; turn = i; while (flag[i] && turn == i); // critical section; flag[j] = false. Satisfies all three requirements: mutual exclusion, progress, bounded waiting.",
    category: "Peterson's Solution",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 86,
    question: "Prove that Peterson's Solution satisfies mutual exclusion.",
    answer:
      "Proof by contradiction: Assume both P0 and P1 in critical section simultaneously. For P0 to be in critical section: either flag[1] = false OR turn = 0. For P1 to be in critical section: either flag[0] = false OR turn = 1. But if both in critical section, both flag[0] and flag[1] must be true (set before entering). Therefore turn must be both 0 and 1 simultaneously, which is impossible. Hence mutual exclusion is satisfied.",
    category: "Peterson's Solution",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 87,
    question: "What are the limitations and assumptions of Peterson's Solution?",
    answer:
      "Limitations: 1) Only works for two processes, 2) Requires busy waiting (wastes CPU cycles), 3) Assumes atomic load/store operations, 4) May not work on modern architectures with instruction reordering. Assumptions: 1) LOAD and STORE instructions are atomic, 2) No instruction reordering by compiler/processor, 3) Processes execute at arbitrary speeds, 4) Processes don't fail in critical section.",
    category: "Peterson's Solution",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 88,
    question: "How can Peterson's Solution be extended to n processes?",
    answer:
      "Bakery Algorithm extends Peterson's idea to n processes: Each process takes a number (like bakery queue), process with smallest number enters critical section. Pseudocode: choosing[i] = true; number[i] = max(number[0]...number[n-1]) + 1; choosing[i] = false; for j = 0 to n-1: while (choosing[j]); while (number[j] != 0 && (number[j], j) < (number[i], i)). More complex but maintains all three properties for n processes.",
    category: "Peterson's Solution",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 89,
    question: "What is synchronization hardware and why is it needed?",
    answer:
      "Synchronization hardware: Special CPU instructions that perform multiple operations atomically (cannot be interrupted). Needed because: 1) Software solutions are complex and inefficient, 2) Modern processors may reorder instructions, 3) Busy waiting in software wastes CPU, 4) Hardware solutions are faster and more reliable. Examples: Test-and-Set, Compare-and-Swap, atomic increment/decrement instructions.",
    category: "Hardware Synchronization",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 90,
    question: "Explain Test-and-Set instruction and how it solves critical section problem.",
    answer:
      "Test-and-Set: Atomic instruction that tests and modifies a boolean variable. boolean test_and_set(boolean *target) { boolean rv = *target; *target = true; return rv; }. Critical section solution: shared boolean lock = false. Process: while (test_and_set(&lock)); // critical section; lock = false. Satisfies mutual exclusion (only one process can set lock first) but may not satisfy bounded waiting without additional mechanisms.",
    category: "Hardware Synchronization",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 91,
    question: "What is Compare-and-Swap and how does it differ from Test-and-Set?",
    answer:
      "Compare-and-Swap: Atomic instruction that compares and conditionally swaps values. int compare_and_swap(int *value, int expected, int new_value) { int temp = *value; if (*value == expected) *value = new_value; return temp; }. Difference from Test-and-Set: 1) More flexible - can compare any values, 2) Can implement lock-free data structures, 3) Basis for modern atomic operations, 4) Can detect if another process modified value.",
    category: "Hardware Synchronization",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 92,
    question: "How can hardware instructions be used to implement bounded waiting?",
    answer:
      "Bounded waiting with Test-and-Set: Use additional arrays to track waiting processes. boolean waiting[n] = {false}; boolean lock = false. Process i: waiting[i] = true; key = true; while (waiting[i] && key) key = test_and_set(&lock); waiting[i] = false; // critical section; j = (i + 1) % n; while ((j != i) && !waiting[j]) j = (j + 1) % n; if (j == i) lock = false; else waiting[j] = false. Ensures bounded waiting by serving processes in order.",
    category: "Hardware Synchronization",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 93,
    question: "What are atomic variables and how do they help in synchronization?",
    answer:
      "Atomic variables: Variables that can be accessed atomically without explicit locking. Operations like read, write, increment, decrement are guaranteed to be atomic. Help in synchronization by: 1) Eliminating race conditions for simple operations, 2) Providing lock-free programming primitives, 3) Better performance than locks for simple updates, 4) Avoiding deadlock issues. Examples: atomic_int, atomic_bool in C++11, volatile in Java.",
    category: "Hardware Synchronization",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 94,
    question: "Define semaphore and explain its two atomic operations.",
    answer:
      "Semaphore: Integer variable accessed only through two atomic operations. wait(S): while (S <= 0); S--; (also called P() or down()). signal(S): S++; (also called V() or up()). Properties: 1) Operations are atomic (indivisible), 2) Value represents available resources, 3) Negative value indicates waiting processes, 4) Used for mutual exclusion and synchronization, 5) No busy waiting in proper implementation.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 95,
    question: "Differentiate between counting and binary semaphores with examples.",
    answer:
      "Counting Semaphore: Value can range over unrestricted domain. Used for: 1) Resource counting (printer pool), 2) Synchronization (producer-consumer). Example: semaphore printers = 3 (3 printers available). Binary Semaphore (Mutex): Value restricted to 0 or 1. Used for: 1) Mutual exclusion, 2) Critical section protection. Example: semaphore mutex = 1 (binary lock). Binary semaphore simpler to implement and understand.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 96,
    question: "How are semaphores implemented without busy waiting?",
    answer:
      "Implementation with waiting queue: typedef struct { int value; struct process *list; } semaphore. wait(S): S->value--; if (S->value < 0) { add process to S->list; block(); }. signal(S): S->value++; if (S->value <= 0) { remove process P from S->list; wakeup(P); }. Block() suspends calling process, wakeup(P) resumes process P. Eliminates busy waiting by using process scheduling.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 97,
    question: "What is the significance of negative semaphore values?",
    answer:
      "Negative semaphore value indicates number of processes waiting for the resource. Example: If semaphore value is -3, it means 3 processes are blocked waiting for signal(). When signal() is called, value becomes -2 and one process is awakened. Value becomes non-negative when no processes are waiting. This helps in understanding system state and debugging synchronization issues.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 98,
    question: "Solve the critical section problem using semaphores.",
    answer:
      "Solution using binary semaphore: semaphore mutex = 1. Process: wait(mutex); // critical section; signal(mutex); // remainder section. This ensures: 1) Mutual exclusion - only one process can acquire mutex, 2) Progress - if no process in critical section, mutex available, 3) Bounded waiting - depends on semaphore implementation (FIFO queue ensures bounded waiting).",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 99,
    question: "What are the main problems and limitations of semaphores?",
    answer:
      "Problems: 1) Priority Inversion - low priority process holds resource needed by high priority process, 2) Deadlock - circular waiting for semaphores, 3) Programming errors - forget signal(), call wait() twice, 4) No inherent protection against mistakes, 5) Difficult to debug and verify correctness. Limitations: 1) Low-level primitive, 2) Easy to misuse, 3) No automatic cleanup, 4) Scattered wait/signal calls make code hard to understand.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 100,
    question: "Explain priority inversion and its solutions.",
    answer:
      "Priority Inversion: High priority process blocked by low priority process holding needed resource, while medium priority process runs. Example: H needs resource held by L, M preempts L, H waits indefinitely. Solutions: 1) Priority Inheritance - L inherits H's priority temporarily, 2) Priority Ceiling - resource has ceiling priority, holder gets that priority, 3) Disable preemption in critical sections. Mars Pathfinder experienced this problem in 1997.",
    category: "Semaphores",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 101,
    question: "Describe the Bounded-Buffer problem and its semaphore solution.",
    answer:
      "Problem: Producer adds items to buffer, consumer removes items. Buffer has finite size n. Solution uses 3 semaphores: semaphore full = 0 (counts full slots), empty = n (counts empty slots), mutex = 1 (mutual exclusion). Producer: wait(empty); wait(mutex); // add item; signal(mutex); signal(full). Consumer: wait(full); wait(mutex); // remove item; signal(mutex); signal(empty). Order of wait() calls is crucial to avoid deadlock.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 102,
    question: "Why is the order of semaphore operations important in producer-consumer solution?",
    answer:
      "Correct order prevents deadlock. Producer: wait(empty) then wait(mutex). Consumer: wait(full) then wait(mutex). Wrong order causes deadlock: If producer does wait(mutex) then wait(empty), and buffer is full, producer holds mutex while waiting for empty slot. Consumer cannot proceed because it needs mutex to remove item. System deadlocks. Always acquire resource semaphores before mutex semaphores.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 103,
    question: "Explain the Readers-Writers problem and its constraints.",
    answer:
      "Problem: Database shared among processes. Readers only read, writers read and write. Constraints: 1) Multiple readers can access simultaneously (no data corruption), 2) Only one writer can access at a time, 3) No reader and writer can access simultaneously, 4) Writers need exclusive access. Variations: 1) First readers-writers (readers priority), 2) Second readers-writers (writers priority), 3) Third readers-writers (fair scheduling).",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Intermediate",
  },
  {
    id: 104,
    question: "Provide semaphore solution for First Readers-Writers problem.",
    answer:
      "Solution (readers priority): semaphore rw_mutex = 1 (writer exclusion), mutex = 1 (protect read_count), int read_count = 0. Reader: wait(mutex); read_count++; if (read_count == 1) wait(rw_mutex); signal(mutex); // reading; wait(mutex); read_count--; if (read_count == 0) signal(rw_mutex); signal(mutex). Writer: wait(rw_mutex); // writing; signal(rw_mutex). Problem: Writers may starve if readers keep arriving.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 105,
    question: "How does the Second Readers-Writers problem differ and what's its solution?",
    answer:
      "Second Readers-Writers gives priority to writers. Once writer arrives, no new readers allowed until writer finishes. Additional semaphores needed: semaphore read_try = 1 (controls reader entry), write_count, write_mutex. Writer increments write_count and blocks read_try when first writer arrives. Readers must acquire read_try before proceeding. This prevents reader starvation of writers but may cause reader starvation.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 106,
    question: "Describe the Dining-Philosophers problem in detail.",
    answer:
      "Problem: 5 philosophers around circular table, 5 chopsticks between them. Each philosopher thinks, gets hungry, picks up 2 adjacent chopsticks, eats, puts down chopsticks, repeats. Constraints: 1) Can only pick up one chopstick at a time, 2) Cannot pick up chopstick held by neighbor, 3) Need both chopsticks to eat. Represents resource allocation problem with potential for deadlock (all pick up left chopstick simultaneously) and starvation.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 107,
    question: "What causes deadlock in the naive Dining-Philosophers solution?",
    answer:
      "Naive solution: semaphore chopstick[5] = {1,1,1,1,1}. Philosopher i: wait(chopstick[i]); wait(chopstick[(i+1)%5]); // eat; signal(chopstick[(i+1)%5]); signal(chopstick[i]). Deadlock occurs when all philosophers simultaneously pick up left chopstick - each holds one chopstick and waits for right chopstick held by neighbor. System deadlocks because circular wait condition is satisfied.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 108,
    question: "Provide three different solutions to prevent deadlock in Dining-Philosophers.",
    answer:
      "1) Allow at most 4 philosophers at table simultaneously (prevents circular wait). 2) Pick up both chopsticks atomically or none (all-or-nothing approach). 3) Asymmetric solution: odd philosophers pick left then right, even philosophers pick right then left (breaks circular wait). 4) Use timeout mechanism. 5) Central coordinator assigns chopsticks. Each solution breaks at least one deadlock condition.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 109,
    question: "Implement the asymmetric solution for Dining-Philosophers problem.",
    answer:
      "Asymmetric solution: Philosopher i (odd): wait(chopstick[i]); wait(chopstick[(i+1)%5]); // eat; signal(chopstick[(i+1)%5]); signal(chopstick[i]). Philosopher i (even): wait(chopstick[(i+1)%5]); wait(chopstick[i]); // eat; signal(chopstick[i]); signal(chopstick[(i+1)%5]). This breaks circular wait because at least one philosopher will pick up chopsticks in different order, preventing deadlock cycle.",
    category: "Classic Problems",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },
  {
    id: 110,
    question: "What is a monitor and how does it differ from semaphores?",
    answer:
      "Monitor: High-level synchronization construct with data, procedures, and synchronization primitives encapsulated together. Only one process can be active in monitor at a time. Differences from semaphores: 1) Higher level abstraction, 2) Automatic mutual exclusion, 3) Condition variables for waiting, 4) Structured programming approach, 5) Compiler enforced synchronization. Easier to use correctly than semaphores.",
    category: "Monitors",
    chapter: "Chapter 6: Process Synchronization",
    difficulty: "Advanced",
  },

  // Chapter 7: Deadlocks - Comprehensive Questions (111-200)
  {
    id: 111,
    question: "Define deadlock and provide multiple real-world analogies.",
    answer:
      "Deadlock: Set of blocked processes each holding a resource and waiting to acquire a resource held by another process in the set. Analogies: 1) Bridge crossing - cars from both ends meet in middle, 2) Four-way stop with stubborn drivers, 3) Dining philosophers with chopsticks, 4) Two people trying to pass through narrow doorway simultaneously, 5) Circular chain of people each needing something from the next person. All involve circular dependency and mutual blocking.",
    category: "Deadlock Basics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Basic",
  },
  {
    id: 112,
    question: "Explain the system model for deadlock analysis including resource types and instances.",
    answer:
      "System Model: Resource types R1, R2, ..., Rm (CPU cycles, memory space, I/O devices, files, semaphores). Each resource type Ri has Wi instances. Process operations: 1) Request: Process requests resource instance, may wait if unavailable, 2) Use: Process operates on allocated resource, 3) Release: Process releases resource when done. Deadlock occurs when processes cannot complete request-use-release cycle due to circular dependencies.",
    category: "Deadlock Basics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 113,
    question: "What are the four necessary conditions for deadlock? Explain each with examples.",
    answer:
      "Four Coffman conditions (all must hold): 1) Mutual Exclusion: Resource used by only one process at a time (printer, write access to file), 2) Hold and Wait: Process holds resources while waiting for others (process has CPU, waits for disk), 3) No Preemption: Resources cannot be forcibly taken away (cannot preempt printer mid-job), 4) Circular Wait: Circular chain of processes each waiting for resource held by next (P1→R1→P2→R2→P1). All four must be present simultaneously.",
    category: "Deadlock Conditions",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 114,
    question: "What are the three main methods for handling deadlocks?",
    answer:
      "Three methods: 1) Prevention/Avoidance: Ensure system never enters deadlock state by preventing one of four necessary conditions or using algorithms like Banker's algorithm, 2) Detection and Recovery: Allow deadlock to occur, detect it, then recover through process termination or resource preemption, 3) Ignore Problem: Pretend deadlocks never occur (used by most operating systems like Windows, Linux). Application developer responsible for handling deadlocks.",
    category: "Deadlock Handling",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 115,
    question: "How can the mutual exclusion condition be prevented?",
    answer:
      "Mutual exclusion cannot be denied for non-sharable resources (printers, write access). However, it can be eliminated for some resources: 1) Make resources sharable when possible (read-only files), 2) Use spooling for devices like printers, 3) Virtual devices through software simulation, 4) Copy-on-write for memory pages. Generally not practical solution as many resources are inherently non-sharable by nature.",
    category: "Deadlock Prevention",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 116,
    question: "Explain methods to prevent the hold-and-wait condition.",
    answer:
      "Two approaches: 1) Process must request all resources at once before execution begins. Disadvantages: low resource utilization, starvation possible. 2) Process can request resources only when it has none (release all before requesting new ones). Disadvantages: resources may be released and immediately re-requested. Both approaches have poor resource utilization and may cause starvation of processes requiring many resources.",
    category: "Deadlock Prevention",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 117,
    question: "How can the no-preemption condition be eliminated?",
    answer:
      "Allow preemption of resources: 1) If process holding resources requests another unavailable resource, preempt all its resources, 2) Resources preempted from waiting process, 3) Process restarted only when it can regain old resources plus new ones. Works for resources whose state can be saved/restored (CPU, memory) but not for others (printers, tape drives). May cause significant overhead and complexity.",
    category: "Deadlock Prevention",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 118,
    question: "Describe methods to prevent circular wait condition.",
    answer:
      "Impose total ordering on resource types: 1) Number all resource types uniquely, 2) Process can request resources only in increasing order of enumeration, 3) If process needs R1 and R2 where R1 < R2, must request R1 first. Alternative: Process holding Ri can request Rj only if j > i. This prevents circular wait by ensuring no cycle in resource allocation graph. Most practical deadlock prevention method.",
    category: "Deadlock Prevention",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 119,
    question: "What are the disadvantages of deadlock prevention methods?",
    answer:
      "Disadvantages: 1) Low device utilization - resources may be allocated but unused, 2) Reduced system throughput - processes may wait unnecessarily, 3) Starvation - some processes may never get required resource combination, 4) Inconvenient programming model - must know all resources in advance, 5) May prevent useful resource sharing patterns, 6) Overhead of maintaining resource ordering. Prevention is often too restrictive for practical systems.",
    category: "Deadlock Prevention",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 120,
    question: "What is deadlock avoidance and how does it differ from prevention?",
    answer:
      "Deadlock Avoidance: Dynamically examine resource allocation state to ensure system never enters deadlock state. Requires advance information about maximum resource needs. Prevention: Statically prevent one of four necessary conditions. Avoidance: Allow all four conditions but avoid unsafe states. Avoidance is less restrictive than prevention but requires additional information and runtime overhead for safety checking.",
    category: "Deadlock Avoidance",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 121,
    question: "Define safe state, unsafe state, and their relationship to deadlock.",
    answer:
      "Safe State: System can allocate resources to each process in some order and avoid deadlock. Sequence <P1, P2, ..., Pn> is safe if for each Pi, resources Pi can still request can be satisfied by currently available resources plus resources held by all Pj where j < i. Unsafe State: No safe sequence exists. Key: Safe state guarantees no deadlock, unsafe state may lead to deadlock but doesn't guarantee it. All deadlock states are unsafe, but not all unsafe states lead to deadlock.",
    category: "Deadlock Avoidance",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 122,
    question: "Explain the Banker's Algorithm and its key concepts.",
    answer:
      "Banker's Algorithm: Resource allocation and deadlock avoidance algorithm for multiple instances. Tests all resource requests, checks for safe state. Based on concept that banks lend only if resources permit. Key concepts: 1) Each process declares maximum need a priori, 2) Process may wait for resources, 3) Process must return resources in finite time, 4) Grant request only if resulting state is safe. Uses Available, Allocation, and Need matrices to determine safety.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 123,
    question: "Describe the data structures used in Banker's Algorithm.",
    answer:
      "Data structures for n processes and m resource types: 1) Available[m]: Number of available instances of each resource type, 2) Max[n][m]: Maximum demand of each process for each resource type, 3) Allocation[n][m]: Number of resources of each type currently allocated to each process, 4) Need[n][m]: Remaining resource need of each process. Relationship: Need[i][j] = Max[i][j] - Allocation[i][j]. These matrices are updated as resources are allocated and released.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 124,
    question: "Explain the Safety Algorithm used in Banker's Algorithm.",
    answer:
      "Safety Algorithm determines if system is in safe state: 1) Initialize Work = Available, Finish[i] = false for all i, 2) Find process Pi where Finish[i] = false and Need[i] ≤ Work, 3) If found: Work = Work + Allocation[i], Finish[i] = true, go to step 2, 4) If no such process found, check if Finish[i] = true for all i. If yes, system is safe; if no, system is unsafe. Algorithm simulates process completion to verify safety.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 125,
    question: "Describe the Resource-Request Algorithm in Banker's Algorithm.",
    answer:
      "Resource-Request Algorithm for process Pi requesting Request[m]: 1) Check if Request ≤ Need[i], else error (exceeds maximum claim), 2) Check if Request ≤ Available, else wait (resources not available), 3) Pretend allocation: Available = Available - Request, Allocation[i] = Allocation[i] + Request, Need[i] = Need[i] - Request, 4) Run Safety Algorithm, 5) If safe, grant request; if unsafe, restore old state and make Pi wait. Ensures system remains in safe state.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 126,
    question: "Work through a Banker's Algorithm example with 5 processes and 3 resource types.",
    answer:
      "Example: Processes P0-P4, Resources A(10), B(5), C(7). Current state: Available = (3,3,2). Allocation matrix: P0(0,1,0), P1(2,0,0), P2(3,0,2), P3(2,1,1), P4(0,0,2). Max matrix: P0(7,5,3), P1(3,2,2), P2(9,0,2), P3(2,2,2), P4(4,3,3). Need = Max - Allocation. Safety check finds sequence <P1,P3,P4,P2,P0> is safe. If P1 requests (1,0,2): Check Request ≤ Need[1] and Request ≤ Available, then test resulting state for safety.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 127,
    question: "What are the limitations and disadvantages of Banker's Algorithm?",
    answer:
      "Limitations: 1) Must know maximum resource needs in advance (often unknown), 2) Number of processes must be fixed, 3) Resources must not vary (no dynamic allocation/deallocation), 4) Processes must return resources in finite time, 5) High overhead for safety checking on each request. Disadvantages: 1) Conservative approach reduces resource utilization, 2) Not practical for real systems with varying resource needs, 3) Doesn't handle priority or real-time constraints, 4) Assumes worst-case scenarios.",
    category: "Banker's Algorithm",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 128,
    question: "What is a resource allocation graph and how is it used in deadlock detection?",
    answer:
      "Resource Allocation Graph: Directed graph representing resource allocation state. Vertices: Processes (circles) and Resources (rectangles). Edges: Request edge (process → resource), Assignment edge (resource → process). For single instance resources: Deadlock exists if and only if cycle exists in graph. For multiple instances: Cycle is necessary but not sufficient condition. Graph helps visualize resource dependencies and detect potential deadlocks.",
    category: "Deadlock Detection",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 129,
    question: "How do you detect deadlock in systems with single instance resources?",
    answer:
      "Single Instance Detection: Use wait-for graph (variant of resource allocation graph). Nodes are processes only. Edge Pi → Pj means Pi waits for resource held by Pj. Algorithm: 1) Maintain wait-for graph, 2) Periodically invoke cycle detection algorithm, 3) If cycle exists, deadlock detected. Cycle detection: Use DFS or maintain topological ordering. Time complexity: O(n²) where n is number of processes. Simple and efficient for single instance systems.",
    category: "Deadlock Detection",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 130,
    question: "Explain deadlock detection algorithm for multiple instance resources.",
    answer:
      "Multiple Instance Detection Algorithm: Similar to Banker's safety algorithm but for current state. Data structures: Available[m], Allocation[n][m], Request[n][m]. Algorithm: 1) Initialize Work = Available, Finish[i] = false if Allocation[i] ≠ 0, else true, 2) Find process Pi where Finish[i] = false and Request[i] ≤ Work, 3) If found: Work = Work + Allocation[i], Finish[i] = true, go to step 2, 4) If Finish[i] = false for some i, system is deadlocked and Pi is deadlocked.",
    category: "Deadlock Detection",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 131,
    question: "When should the deadlock detection algorithm be invoked?",
    answer:
      "Invocation frequency depends on: 1) How often deadlock occurs, 2) How many processes affected. Options: 1) Every time request cannot be granted immediately (expensive but quick detection), 2) Periodically (every hour, day), 3) When CPU utilization drops below threshold (may indicate deadlock). Trade-off: Frequent invocation has high overhead but quick detection; infrequent invocation has low overhead but delayed detection and more affected processes.",
    category: "Deadlock Detection",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 132,
    question: "What are the methods for deadlock recovery?",
    answer:
      "Two main approaches: 1) Process Termination: a) Abort all deadlocked processes (expensive), b) Abort one process at a time until deadlock cycle eliminated (overhead of detection after each termination). 2) Resource Preemption: a) Select victim process, b) Rollback to safe state, c) Prevent starvation through priority aging. Process termination is simpler but wasteful; resource preemption is complex but preserves work done.",
    category: "Deadlock Recovery",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 133,
    question: "What factors should be considered when selecting a victim for process termination?",
    answer:
      "Victim selection factors: 1) Priority of process (terminate lower priority first), 2) Computation time and remaining time, 3) Resources used and still needed, 4) Number of processes to be terminated, 5) Interactive vs batch process (batch preferred for termination), 6) How many times process has been selected as victim (prevent starvation). Goal: Minimize cost of recovery while breaking deadlock cycle effectively.",
    category: "Deadlock Recovery",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 134,
    question: "Explain the challenges of resource preemption in deadlock recovery.",
    answer:
      "Resource Preemption Challenges: 1) Selecting victim: Which process and resources to preempt (cost minimization), 2) Rollback: Return process to safe state before resource acquisition (requires checkpointing), 3) Starvation: Same process may be repeatedly selected as victim (use aging or limit selection count). Rollback options: Total rollback (restart from beginning) or partial rollback (return to safe state). Requires sophisticated state management and recovery mechanisms.",
    category: "Deadlock Recovery",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 135,
    question: "Compare the three deadlock handling strategies: prevention, avoidance, and detection/recovery.",
    answer:
      "Prevention: Pros - Simple, no runtime overhead. Cons - Low resource utilization, restrictive. Avoidance: Pros - Better resource utilization than prevention. Cons - Requires advance information, runtime overhead. Detection/Recovery: Pros - No restrictions on resource requests, good utilization. Cons - Detection overhead, recovery cost, data loss possible. Choice depends on: deadlock frequency, system requirements, acceptable overhead, and resource characteristics.",
    category: "Deadlock Comparison",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 136,
    question: "Why do most operating systems ignore the deadlock problem?",
    answer:
      "Ostrich Algorithm: Ignore deadlocks because: 1) Deadlocks occur infrequently in practice, 2) Cost of prevention/avoidance/detection may exceed benefits, 3) Other system failures (hardware, software bugs) more common, 4) User can restart system if deadlock occurs, 5) Application-level handling may be more appropriate. Used by Windows, Linux, UNIX. Trade-off: Accept occasional deadlock vs constant overhead of deadlock handling mechanisms.",
    category: "Deadlock Comparison",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 137,
    question: "How do modern systems handle deadlocks in practice?",
    answer:
      "Modern approaches: 1) Database systems use deadlock detection and rollback, 2) Real-time systems use prevention or avoidance, 3) General-purpose OS rely on application-level handling, 4) Lock ordering in kernel code, 5) Timeout mechanisms for resource requests, 6) Lock-free programming techniques, 7) Transactional memory systems. Combination of techniques based on specific requirements and constraints of each system component.",
    category: "Deadlock Comparison",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 138,
    question: "Explain livelock and how it differs from deadlock.",
    answer:
      "Livelock: Processes continuously change state in response to other processes but make no progress. Differences from deadlock: 1) Processes not blocked (actively running), 2) System appears busy but accomplishes nothing, 3) Processes respond to each other but can't proceed. Example: Two people trying to pass in hallway, both step same direction repeatedly. Solutions: Random delays, priority schemes, exponential backoff. Harder to detect than deadlock because processes appear active.",
    category: "Related Concepts",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 139,
    question: "What is priority inversion and how does it relate to deadlocks?",
    answer:
      "Priority Inversion: High-priority process blocked by lower-priority process holding needed resource, while medium-priority process runs. Not deadlock but similar blocking effect. Example: H needs resource held by L, M preempts L, H waits. Solutions: 1) Priority Inheritance Protocol - L inherits H's priority, 2) Priority Ceiling Protocol - resource has ceiling priority. Mars Pathfinder mission experienced this problem. Can contribute to deadlock in complex scenarios.",
    category: "Related Concepts",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 140,
    question: "How do distributed systems handle deadlocks?",
    answer:
      "Distributed Deadlock Challenges: 1) No global state information, 2) Communication delays and failures, 3) Partial information at each node. Approaches: 1) Distributed deadlock detection algorithms (path-pushing, edge-chasing), 2) Timeout-based detection, 3) Hierarchical deadlock detection, 4) Prevention through global resource ordering, 5) Avoidance using distributed consensus. More complex than centralized systems due to network partitions and communication overhead.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 141,
    question: "Explain the concept of phantom deadlocks in distributed systems.",
    answer:
      "Phantom Deadlock: False deadlock detection due to message delays in distributed systems. Occurs when: 1) Process releases resource, 2) Detection algorithm starts before release message propagates, 3) Algorithm detects deadlock that no longer exists, 4) Unnecessary recovery actions taken. Solutions: 1) Use logical timestamps, 2) Confirmation protocols, 3) Multiple detection rounds. Demonstrates challenges of maintaining consistent global state in distributed environments.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 142,
    question: "How do database systems handle deadlocks?",
    answer:
      "Database Deadlock Handling: 1) Detection: Maintain wait-for graph, periodic cycle detection, 2) Recovery: Abort one transaction (victim selection based on cost), 3) Prevention: Two-phase locking, timestamp ordering, 4) Timeout: Abort transactions exceeding time limit. Victim selection considers: transaction age, work done, locks held, restart cost. Databases favor detection/recovery over prevention due to better concurrency and performance.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 143,
    question: "What are lock-free and wait-free algorithms in relation to deadlock avoidance?",
    answer:
      "Lock-free: At least one thread makes progress in finite steps (system-wide progress). Wait-free: Every thread makes progress in finite steps (per-thread progress). Benefits: 1) No deadlocks (no locks used), 2) No priority inversion, 3) Better scalability, 4) Fault tolerance. Challenges: 1) Complex programming model, 2) ABA problem, 3) Memory management issues, 4) Limited applicability. Use atomic operations like Compare-and-Swap for implementation.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 144,
    question: "Explain the ABA problem in lock-free programming.",
    answer:
      "ABA Problem: Value changes from A to B and back to A between reads, making Compare-and-Swap think nothing changed. Example: Stack operations where node is removed and re-added with same address but different content. Solutions: 1) Use version numbers/tags with pointers, 2) Hazard pointers for memory management, 3) Double-width CAS operations, 4) Epoch-based memory reclamation. Critical issue in lock-free data structure design.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 145,
    question: "How do real-time systems handle deadlocks?",
    answer:
      "Real-time Deadlock Handling: 1) Prevention preferred (predictable timing), 2) Priority Inheritance Protocol (PIP), 3) Priority Ceiling Protocol (PCP), 4) Stack Resource Policy (SRP), 5) Immediate Priority Ceiling Protocol. Focus on: 1) Bounded blocking time, 2) Predictable worst-case behavior, 3) Meeting deadlines, 4) Avoiding priority inversion. Avoidance and detection less suitable due to unpredictable timing overhead.",
    category: "Advanced Topics",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 146,
    question: "What is the dining philosophers problem and its variations?",
    answer:
      "Classic synchronization problem: 5 philosophers, 5 chopsticks, need 2 chopsticks to eat. Variations: 1) Cigarette smokers problem, 2) Sleeping barber problem, 3) Readers-writers problem, 4) Producer-consumer problem. Solutions demonstrate different synchronization techniques: semaphores, monitors, message passing. Illustrates resource allocation, deadlock, starvation, and fairness issues. Used to teach synchronization concepts and evaluate solutions.",
    category: "Classic Problems",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Intermediate",
  },
  {
    id: 147,
    question: "Analyze the resource allocation graph for deadlock detection.",
    answer:
      "Resource Allocation Graph Analysis: 1) Draw processes (circles) and resources (rectangles), 2) Add request edges (process → resource) and assignment edges (resource → process), 3) Look for cycles in graph. Single instance: Cycle = Deadlock. Multiple instances: Cycle = Potential deadlock, need further analysis. Reduction: Remove processes that can complete with available resources. If all processes can be removed, no deadlock; otherwise, remaining processes are deadlocked.",
    category: "Graph Analysis",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 148,
    question: "How do you implement deadlock detection using graph algorithms?",
    answer:
      "Implementation approaches: 1) Adjacency matrix representation, 2) Depth-First Search (DFS) for cycle detection, 3) Topological sorting approach, 4) Union-Find for cycle detection. DFS Algorithm: Mark nodes as white (unvisited), gray (visiting), black (visited). If DFS encounters gray node, cycle exists. Time complexity: O(V + E). Space complexity: O(V). Efficient for sparse graphs common in resource allocation scenarios.",
    category: "Graph Analysis",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 149,
    question: "What are the performance implications of different deadlock handling strategies?",
    answer:
      "Performance Analysis: Prevention - No runtime overhead but poor resource utilization (10-20% degradation). Avoidance - Moderate overhead for safety checking, better utilization than prevention. Detection - Low steady-state overhead, high recovery cost when deadlock occurs. Ignore - No overhead until deadlock occurs, then system restart cost. Factors: deadlock frequency, system load, resource contention, recovery time. Choose based on application requirements and acceptable trade-offs.",
    category: "Performance Analysis",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
  {
    id: 150,
    question: "How do you design a deadlock-free system?",
    answer:
      "Design Principles: 1) Minimize resource sharing, 2) Use timeouts for resource requests, 3) Implement resource ordering protocols, 4) Design for graceful degradation, 5) Use lock-free algorithms where possible, 6) Implement proper error handling and recovery, 7) Monitor system for deadlock indicators, 8) Use hierarchical locking schemes. Consider: system requirements, performance constraints, complexity trade-offs, maintenance overhead.",
    category: "System Design",
    chapter: "Chapter 7: Deadlocks",
    difficulty: "Advanced",
  },
]

const ProcessSchedulingQA: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [selectedChapter, setSelectedChapter] = useState<string>("All")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")

  const chapters = [
    "All",
    "Chapter 5: Process Scheduling",
    "Chapter 6: Process Synchronization",
    "Chapter 7: Deadlocks",
    "Chapter 8: Main Memory",
  ]
  const categories = ["All", ...Array.from(new Set(qaData.map((item) => item.category)))]
  const difficulties = ["All", "Basic", "Intermediate", "Advanced"]

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredData = qaData.filter((item) => {
    const chapterMatch = selectedChapter === "All" || item.chapter === selectedChapter
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "All" || item.difficulty === selectedDifficulty
    return chapterMatch && categoryMatch && difficultyMatch
  })

  const getCategoryIcon = (category: string) => {
    if (category.includes("Deadlock") || category.includes("Detection") || category.includes("Recovery")) {
      return <AlertTriangle className="w-4 h-4" />
    }
    if (category.includes("Security") || category.includes("Protection") || category.includes("Synchronization")) {
      return <Shield className="w-4 h-4" />
    }
    switch (category) {
      case "Basic Concepts":
      case "Main Memory Basics":
      case "Synchronization Basics":
      case "Deadlock Basics":
        return <BookOpen className="w-4 h-4" />
      case "Scheduling Criteria":
      case "Address Binding":
      case "Critical Section":
      case "Deadlock Conditions":
        return <Clock className="w-4 h-4" />
      case "Multi-Processor":
      case "Paging":
      case "Hardware Synchronization":
      case "Banker's Algorithm":
        return <Users className="w-4 h-4" />
      default:
        return <Cpu className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getChapterStats = () => {
    const stats = chapters.slice(1).map((chapter) => ({
      chapter,
      total: qaData.filter((q) => q.chapter === chapter).length,
      basic: qaData.filter((q) => q.chapter === chapter && q.difficulty === "Basic").length,
      intermediate: qaData.filter((q) => q.chapter === chapter && q.difficulty === "Intermediate").length,
      advanced: qaData.filter((q) => q.chapter === chapter && q.difficulty === "Advanced").length,
    }))
    return stats
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Operating Systems - Comprehensive Q&A</h1>
        <p className="text-lg text-gray-600">
          Complete question bank covering Process Scheduling, Process Synchronization, Deadlocks, and Main Memory
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {getChapterStats().map((stat) => (
            <div key={stat.chapter} className="bg-gray-50 p-3 rounded-lg">
              <div className="font-semibold text-gray-800">{stat.chapter.split(": ")[1]}</div>
              <div className="text-2xl font-bold text-blue-600">{stat.total}</div>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">{stat.basic}B</span>
                <span className="text-yellow-600">{stat.intermediate}I</span>
                <span className="text-red-600">{stat.advanced}A</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Chapter:</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {chapters.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Showing {filteredData.length} of {qaData.length} questions
      </div>

      {/* Q&A Items */}
      <div className="space-y-4">
        {filteredData.map((item) => (
          <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(item.category)}
                    <span className="text-xs text-gray-500">{item.chapter}</span>
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}
                    >
                      {item.difficulty}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-relaxed">
                    Q{item.id}: {item.question}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                  className="ml-4 flex-shrink-0"
                >
                  {expandedItems.has(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {expandedItems.has(item.id) && (
              <CardContent className="pt-0">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{item.answer}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Study Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Study Tips for Operating Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Key Concepts to Master:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Understand scheduling algorithms and their trade-offs</li>
                <li>• Master memory management techniques (paging, segmentation)</li>
                <li>• Know synchronization mechanisms and classic problems</li>
                <li>• Understand deadlock conditions, prevention, and recovery</li>
                <li>• Practice numerical problems and algorithm calculations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Exam Preparation:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Practice Gantt charts and timing calculations</li>
                <li>• Understand resource allocation graphs</li>
                <li>• Know when to apply each synchronization technique</li>
                <li>• Master Banker's algorithm and safety checking</li>
                <li>• Understand memory allocation strategies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProcessSchedulingQA
