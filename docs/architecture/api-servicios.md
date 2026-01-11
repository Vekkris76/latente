# LATENTE — API de Servicios (generado desde código)

Generado: 2026-01-10T10:08:07.510Z
Fuente de verdad: `src/application/services/**`

Este documento se genera automáticamente para evitar desalineación entre documentación y repo.

## AccountDeletionService
**Ruta:** `src/application/services/AccountDeletionService.ts`

**Constructor**

```ts
constructor(private eventRepo: EventRepository, private patternRepo: PatternRepository, private coPresenceRepo: CoPresenceRepository, private proposalRepo: WindowProposalRepository, private activeWindowRepo: ActiveWindowRepository, private recognitionRepo: RecognitionRepository, private revelationRepo: RevelationRepository, private conversationRepo: ConversationRepository, private cooldownRepo: CooldownRepository, private proposalStateRepo: ProposalStateRepository, private userRepo: UserRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async deleteAccount(userId: string, now: Date): Promise<void>
```

## ActiveWindowService
**Ruta:** `src/application/services/ActiveWindowService.ts`

**Constructor**

```ts
constructor(private activeWindowRepo: ActiveWindowRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async activateFromProposal(proposal: WindowProposal, now: Date): Promise<ActiveWindow>
async getActiveWindowForUser(userId: string, now: Date): Promise<ActiveWindow | null>
```

## CoPresenceDetectionService
**Ruta:** `src/application/services/events/CoPresenceDetectionService.ts`

**Constructor**

```ts
constructor(private patternRepository: PatternRepository, private eventRepository: EventRepository, private copresenceRepository: CoPresenceRepository, private blockRepository: BlockRepository, private reportRepository: ReportRepository, private proposalStateRepository: ProposalStateRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async detectForUsers(userIds: string[]): Promise<LatentCoPresence[]>
```

## EventIngestionService
**Ruta:** `src/application/services/events/EventIngestionService.ts`

**Constructor**

```ts
constructor(private readonly eventRepository: EventRepository, private readonly validator: AbstractEventValidator)
```

**Métodos async (públicos / principales detectados)**

```ts
async ingest(userId: string, input: AbstractEventInput): Promise<AbstractEvent>
```

## PatternDetectionService
**Ruta:** `src/application/services/events/PatternDetectionService.ts`

**Constructor**

```ts
constructor(private eventRepository: EventRepository, private patternRepository: PatternRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async detectForUser(userId: string): Promise<Pattern[]>
```

## PurgeService
**Ruta:** `src/application/services/PurgeService.ts`

**Constructor**

```ts
constructor(private recognitionRepo: RecognitionRepository, private revelationRepo: RevelationRepository, private conversationRepo: ConversationRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async purgeNonMutualRecognitions(now: Date): Promise<number>
async purgeExpiredRevelations(now: Date): Promise<number>
```

## RecognitionService
**Ruta:** `src/application/services/RecognitionService.ts`

**Constructor**

```ts
constructor(private activeWindowRepo: ActiveWindowRepository, private recognitionRepo: RecognitionRepository, private revelationService: RevelationService)
```

**Métodos async (públicos / principales detectados)**

```ts
async confirm(activeWindowId: string, userId: string, now: Date): Promise<Recognition>
```

## RevelationService
**Ruta:** `src/application/services/RevelationService.ts`

**Constructor**

```ts
constructor(private revelationRepo: RevelationRepository, private activeWindowRepo: ActiveWindowRepository, private recognitionRepo: RecognitionRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async createFromActiveWindow(activeWindow: ActiveWindow, now: Date): Promise<Revelation>
async getRevelationForUser(userId: string, now: Date): Promise<Revelation[]>
```

## SafetyService
**Ruta:** `src/application/services/SafetyService.ts`

**Constructor**

```ts
constructor(private blockRepo: BlockRepository, private reportRepo: ReportRepository, private revelationRepo: RevelationRepository, private conversationRepo: ConversationRepository, private coPresenceRepo: CoPresenceRepository, private proposalRepo: WindowProposalRepository, private proposalStateRepo: ProposalStateRepository, private activeWindowRepo: ActiveWindowRepository, private recognitionRepo: RecognitionRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async blockUser(blockerId: string, blockedId: string, now: Date): Promise<Block>
async reportUser(reporterId: string, reportedId: string, reason: ReportReason, now: Date): Promise<Report>
```

## WindowDecisionService
**Ruta:** `src/application/services/WindowDecisionService.ts`

**Constructor**

```ts
constructor(private proposalRepo: WindowProposalRepository, private cooldownRepo: CooldownRepository, private proposalStateRepo: ProposalStateRepository, private coPresenceRepo: CoPresenceRepository)
```

**Métodos async (públicos / principales detectados)**

```ts
async accept(proposalId: string, userId: string, now: Date): Promise<WindowProposal>
async decline(proposalId: string, userId: string, now: Date): Promise<WindowProposal>
async expireProposals(now: Date): Promise<number>
```

## WindowProposalService
**Ruta:** `src/application/services/WindowProposalService.ts`

**Constructor**

```ts
constructor(private proposalRepo: WindowProposalRepository, private cooldownRepo: CooldownRepository, private proposalStateRepo: ProposalStateRepository, private coPresenceRepo: CoPresenceRepository, private patternRepo: PatternRepository, private config: WindowProposalConfig = { durationMinutes: 30 })
```

**Métodos async (públicos / principales detectados)**

```ts
async generateFromCoPresences(now: Date): Promise<WindowProposal[]>
```
