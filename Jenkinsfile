pipeline {
    // Do NOT pin the whole pipeline to built-in — that holds the controller
    // executor for hours and forces a useless first checkout before EC2 work.
    agent none

    options {
        timeout(time: 12, unit: 'HOURS')
        timestamps()
        // Avoid stacking stale workspaces on reused fleet nodes
        skipDefaultCheckout(true)
    }
    parameters {
        choice(name: 'ENV', choices: ['SIT', 'UAT', 'PROD'], description: 'Environment to run tests')
        booleanParam(name: 'LOCALE_EN_US', defaultValue: false, description: 'EN-US — United States')
        booleanParam(name: 'LOCALE_EN_AU', defaultValue: false, description: 'EN-AU — Australia')
        booleanParam(name: 'LOCALE_EN_GB', defaultValue: false, description: 'EN-GB — United Kingdom')
        booleanParam(name: 'LOCALE_EN_AE', defaultValue: false, description: 'EN-AE — United Arab Emirates')
        booleanParam(name: 'LOCALE_EN_IN', defaultValue: false, description: 'EN-IN — India')
        booleanParam(name: 'LOCALE_AR_SA', defaultValue: false, description: 'AR-SA — Saudi Arabia')
        booleanParam(name: 'LOCALE_EN_IE', defaultValue: false, description: 'EN-IE — Ireland')
        booleanParam(name: 'LOCALE_EN_ZA', defaultValue: false, description: 'EN-ZA — South Africa')
        booleanParam(name: 'LOCALE_EN_CA', defaultValue: false, description: 'EN-CA — Canada (English)')
        booleanParam(name: 'LOCALE_FR_CA', defaultValue: false, description: 'FR-CA — Canada (French / Quebec)')
        booleanParam(name: 'LOCALE_DE_DE', defaultValue: false, description: 'DE-DE — Germany')
        booleanParam(name: 'LOCALE_DE_AT', defaultValue: false, description: 'DE-AT — Austria')
        booleanParam(name: 'LOCALE_IT_IT', defaultValue: false, description: 'IT-IT — Italy')
        booleanParam(name: 'LOCALE_TH_TH', defaultValue: false, description: 'TH-TH — Thailand')
        booleanParam(name: 'LOCALE_EN_PH', defaultValue: false, description: 'EN-PH — Philippines')
        booleanParam(name: 'LOCALE_EN_SG', defaultValue: false, description: 'EN-SG — Singapore')
        booleanParam(name: 'LOCALE_EN_NZ', defaultValue: false, description: 'EN-NZ — New Zealand')
        booleanParam(name: 'LOCALE_EN_ID', defaultValue: false, description: 'EN-ID — Indonesia')
        booleanParam(name: 'LOCALE_ZH_HK', defaultValue: false, description: 'ZH-HK — Hong Kong (Traditional Chinese)')
        booleanParam(name: 'LOCALE_EN_MY', defaultValue: false, description: 'EN-MY — Malaysia')
        booleanParam(name: 'RUN_LOCALES_IN_PARALLEL', defaultValue: true, description: 'Run selected locales and US batches in parallel (within each wave). Disable if EC2 fleet agents disconnect.')
        string(
            name: 'MAX_CONCURRENT_AGENTS',
            defaultValue: 'auto',
            description: 'Parallel ec2-fleet jobs per wave. "auto" = detect fleet capacity (min 5). Or set a number (e.g. 5, 8). Values below 5 are allowed only as an explicit override (e.g. 1). Remaining runs start in the next wave.'
        )
        booleanParam(
            name: 'SKIP_PLAYWRIGHT_HOST_DEPS',
            defaultValue: false,
            description: 'Skip OS deps install (playwright install without --with-deps). Only enable AFTER DevOps preinstalls Playwright deps on the ec2-fleet AMI.'
        )
        string(name: 'WORKERS', defaultValue: '', description: 'Playwright workers (blank = auto: 4 for all test types)')
        choice(name: 'TESTS', choices: ['Smoke', 'Regression', 'All', 'FEATURE_SPECIFIC'], description: 'Which tests to run. All = every scenario tagged for the selected locale(s)')
        booleanParam(name: 'US_BATCH1', defaultValue: false, description: 'US — batch-1 (Regression/Smoke/All)')
        booleanParam(name: 'US_BATCH2', defaultValue: false, description: 'US — batch-2 (Regression/Smoke/All)')
        booleanParam(name: 'US_BATCH3', defaultValue: false, description: 'US — batch-3 (Regression/Smoke/All)')
        choice(name: 'FEATURE_TAG', choices: [
            'None',
            'BatConsolidatedPass',
            'ContactUsConsolidatedPass',
            'CancelMembershipConsolidatedPass',
            'CorporateMembershipConsolidatedPass',
            'EventsBookATourConsolidatedPass',
            'EventsFindYourFitphoriaConsolidatedPass',
            'EventsFreeTrialPassConsolidatedPass',
            'EventsJoinOnlineConsolidatedPass',
            'EventsPromoConsolidatedPass',
            'EventsTrainForYourLifeConsolidatedPass',
            'FindAGymConsolidatedPass',
            'HsaFsaMembershipConsolidatedPass',
            'InviteAFriendConsolidatedPass',
            'LocationSearchOnStaticPagesConsolidatedPass',
            'MCOOfferConsolidatedPass',
            'MemberOfferConsolidatedPass',
            'MembershipInquiryConsolidatedPass',
            'OwnAGymConsolidatedPass',
            'TryUsFreeConsolidatedPass',
            'TryUsFreeAppleFitnessFreeTrialOfferConsolidatedPass',
            'TryUsFreeAppleFitnessPlusSubscriberConsolidatedPass',
            'AFW-3303',
            'AFW-3434',
            'AFW-3952',
            'AFW-3953',
            'AFW-3954',
            'AFW-3956',
            'AFW-3957'
        ], description: 'Feature tag @<Flow>ConsolidatedPass or ticket tag @AFW-* (required for FEATURE_SPECIFIC)')
        booleanParam(name: 'GENERATE_ALLURE_REPORT', defaultValue: true, description: 'Generate Allure report')
        booleanParam(name: 'GENERATE_HTML_REPORT', defaultValue: true, description: 'Generate HTML report')
    }

    environment {
        CI = 'true'
    }

    stages {
        // Lightweight param checks only — no checkout, no npm, no fleet pressure.
        // Uses built-in briefly (seconds) then releases; does NOT download the repo.
        stage('Validate Parameters') {
            agent { label 'built-in' }
            options { skipDefaultCheckout(true) }
            steps {
                script {
                    def selectedLocales = getSelectedLocales()
                    if (selectedLocales.isEmpty()) {
                        error('ERROR: No locale selected. Please select at least one locale and re-run.')
                    }

                    if (params.TESTS == 'FEATURE_SPECIFIC' && params.FEATURE_TAG == 'None') {
                        error("ERROR: You selected FEATURE_SPECIFIC but didn't select a feature tag. Please select a feature tag and re-run.")
                    }

                    if ((params.TESTS == 'Regression' || params.TESTS == 'Smoke' || params.TESTS == 'All') && params.LOCALE_EN_US && getSelectedUsBatches().isEmpty()) {
                        error("ERROR: EN-US is selected for ${params.TESTS}. Please select at least one US batch (batch-1, batch-2, and/or batch-3) and re-run.")
                    }

                    def maxAgents = resolveMaxConcurrentAgents()
                    echo "=== Parameter Validation ==="
                    echo "Test Type: ${params.TESTS}"
                    echo "Locales: ${selectedLocales.join(', ')}"
                    echo "Parallel locales: ${params.RUN_LOCALES_IN_PARALLEL}"
                    echo "MAX_CONCURRENT_AGENTS param: ${params.MAX_CONCURRENT_AGENTS}"
                    echo "Resolved concurrent ec2-fleet agents/wave: ${maxAgents} (min parallel=${getMinParallelAgents()})"
                    echo "Workers: ${resolvePlaywrightWorkers()}"
                    if ((params.TESTS == 'Regression' || params.TESTS == 'Smoke' || params.TESTS == 'All') && params.LOCALE_EN_US) {
                        echo "US Batches: ${getSelectedUsBatches().join(', ')}"
                    }
                    if (params.TESTS == 'FEATURE_SPECIFIC') {
                        echo "Feature Tag: ${params.FEATURE_TAG}"
                    }
                    echo "=========================="
                }
            }
        }

        // Flyweight dispatcher (agent none). Do NOT pin this stage to built-in:
        // a nested node('ec2-fleet') inside node('built-in') keeps the controller
        // executor for hours; if that executor is interrupted, every batch's
        // Execute Tests is Cancelled together after Install / Allure History.
        // Real work + checkout still run on ec2-fleet via node() in each branch.
        stage('Run Tests') {
            agent none
            steps {
                script {
                    def localeTagMap = getLocaleTagMap()
                    def selectedLocales = getSelectedLocales()

                    if (selectedLocales.isEmpty()) {
                        error('ERROR: No locale selected. Please select at least one locale and re-run.')
                    }

                    def parallelStages = [:]

                    selectedLocales.each { locale ->
                        def tag = localeTagMap[locale]
                        if (!tag) {
                            error("ERROR: Unsupported locale '${locale}'. Update localeTagMap in Jenkinsfile.")
                        }

                        if ((params.TESTS == 'Regression' || params.TESTS == 'Smoke' || params.TESTS == 'All') && locale == 'EN-US') {
                            def testName
                            def shellCommand
                            if (params.TESTS == 'Regression') {
                                testName = 'test-multi-locale-regression-batch'
                                shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --vars=BATCH,TAG'
                            } else if (params.TESTS == 'Smoke') {
                                testName = 'test-multi-locale-smoke-batch'
                                shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --fixed=Smoke --vars=BATCH,TAG'
                            } else {
                                testName = 'test-multi-locale-all-batch'
                                shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --vars=BATCH,TAG'
                            }

                            getSelectedUsBatches().each { batch ->
                                def runEnv = [
                                    "TAG=${tag}",
                                    "NODE_ENV=${params.ENV}",
                                    "LOCALE=${locale}",
                                    "BATCH=${batch}"
                                ]
                                def pipelineName = "anytimefitness-playwright/${locale.toLowerCase()}/${params.ENV.toLowerCase()}"
                                def stageKey = "${locale}-${batch}"
                                def stageLabel = "${locale} (${batch})"

                                echo "Scheduled: ${stageLabel} (tag=${tag})"
                                echo "Command: ${shellCommand}"
                                echo "Env: ${runEnv.join(' ')}"

                                parallelStages[stageKey] = createStage(shellCommand, testName, runEnv, pipelineName, stageLabel, locale)
                            }
                            return
                        }

                        def testName
                        def shellCommand
                        def runEnv = [
                            "TAG=${tag}",
                            "NODE_ENV=${params.ENV}",
                            "LOCALE=${locale}"
                        ]

                        if (params.TESTS == 'FEATURE_SPECIFIC') {
                            testName = 'test-multi-locale-feature'
                            shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --vars=FEATURE,TAG'
                            runEnv.add("FEATURE=${params.FEATURE_TAG}")
                        } else if (params.TESTS == 'Regression') {
                            testName = 'test-multi-locale-regression'
                            shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --fixed=Regression --vars=TAG'
                        } else if (params.TESTS == 'All') {
                            testName = 'test-multi-locale-all'
                            shellCommand = 'npx bddgen && node scripts/run-playwright-grep.mjs --vars=TAG'
                        } else {
                            // Smoke (and any future simple type)
                            testName = "test-multi-locale-${params.TESTS.toLowerCase()}"
                            shellCommand = "npx bddgen && node scripts/run-playwright-grep.mjs --fixed=${params.TESTS} --vars=TAG"
                        }

                        def pipelineName = "anytimefitness-playwright/${locale.toLowerCase()}/${params.ENV.toLowerCase()}"

                        echo "Scheduled: ${locale} (tag=${tag})"
                        echo "Command: ${shellCommand}"
                        echo "Env: ${runEnv.join(' ')}"

                        parallelStages[locale] = createStage(shellCommand, testName, runEnv, pipelineName, locale)
                    }

                    def maxAgents = resolveMaxConcurrentAgents()
                    echo "Environment: ${params.ENV}"
                    echo "Test Type: ${params.TESTS}"
                    echo "Scheduled ${parallelStages.size()} test run(s)"
                    echo "Parallel within wave: ${params.RUN_LOCALES_IN_PARALLEL}"
                    echo "Max concurrent ec2-fleet agents per wave: ${maxAgents}"

                    runStagesInWaves(parallelStages, maxAgents, params.RUN_LOCALES_IN_PARALLEL)
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished with result: ${currentBuild.currentResult}"
            // No shared controller workspace when agent none — each ec2-fleet node cleans itself.
        }
    }
}

// Locale helpers
def getLocaleTagMap() {
    return [
        'EN-US': 'US',
        'EN-AU': 'AU',
        'EN-GB': 'GB',
        'EN-AE': 'AE',
        'EN-IN': 'IN',
        'AR-SA': 'SA',
        'EN-IE': 'IE',
        'EN-ZA': 'ZA',
        'EN-CA': 'EN-CA',
        'FR-CA': 'FR-CA',
        'DE-DE': 'DE',
        'DE-AT': 'AT',
        'IT-IT': 'IT',
        'TH-TH': 'TH',
        'EN-PH': 'PH',
        'EN-SG': 'SG',
        'EN-NZ': 'NZ',
        'EN-ID': 'ID',
        'ZH-HK': 'ZH-HK',
        'EN-MY': 'EN-MY'
    ]
}

def getSelectedLocales() {
    def localeParams = [
        'EN-US': params.LOCALE_EN_US,
        'EN-AU': params.LOCALE_EN_AU,
        'EN-GB': params.LOCALE_EN_GB,
        'EN-AE': params.LOCALE_EN_AE,
        'EN-IN': params.LOCALE_EN_IN,
        'AR-SA': params.LOCALE_AR_SA,
        'EN-IE': params.LOCALE_EN_IE,
        'EN-ZA': params.LOCALE_EN_ZA,
        'EN-CA': params.LOCALE_EN_CA,
        'FR-CA': params.LOCALE_FR_CA,
        'DE-DE': params.LOCALE_DE_DE,
        'DE-AT': params.LOCALE_DE_AT,
        'IT-IT': params.LOCALE_IT_IT,
        'TH-TH': params.LOCALE_TH_TH,
        'EN-PH': params.LOCALE_EN_PH,
        'EN-SG': params.LOCALE_EN_SG,
        'EN-NZ': params.LOCALE_EN_NZ,
        'EN-ID': params.LOCALE_EN_ID,
        'ZH-HK': params.LOCALE_ZH_HK,
        'EN-MY': params.LOCALE_EN_MY
    ]

    return localeParams.findAll { locale, selected -> selected }.keySet().toList().sort()
}

def getSelectedUsBatches() {
    def batchParams = [
        'batch-1': params.US_BATCH1,
        'batch-2': params.US_BATCH2,
        'batch-3': params.US_BATCH3
    ]

    return batchParams.findAll { batch, selected -> selected }.keySet().toList().sort()
}

def resolvePlaywrightWorkers() {
    if (params.WORKERS?.trim()) {
        return params.WORKERS.trim()
    }
    return '4'
}

/** Floor for auto (and recommended) parallel waves — matches current fleet baseline. */
def getMinParallelAgents() {
    return 5
}

/**
 * Detect how many ec2-fleet agents we can reasonably use:
 * 1) EC2 Fleet cloud maxSize (best — includes on-demand scale-out)
 * 2) Currently online executors with label ec2-fleet
 * 3) Currently idle executors (availability right now)
 * Returns 0 if detection fails (caller applies min/fallback).
 */
def detectEc2FleetCapacity() {
    def labelName = 'ec2-fleet'
    def fleetMax = 0
    def online = 0
    def idle = 0

    try {
        def jenkins = jenkins.model.Jenkins.getInstanceOrNull()
        if (jenkins == null) {
            echo "Auto-parallel: Jenkins instance unavailable — using fallback"
            return 0
        }

        jenkins.clouds.each { cloud ->
            try {
                def className = cloud.class.name ?: ''
                def labelStr = ''
                if (cloud.metaClass.respondsTo(cloud, 'getLabelString')) {
                    labelStr = (cloud.getLabelString() ?: '').toString()
                } else if (cloud.hasProperty('labelString')) {
                    labelStr = (cloud.labelString ?: '').toString()
                }

                def isEc2Fleet = className.contains('EC2Fleet') || className.toLowerCase().contains('ec2fleet')
                def labelMatches = labelStr.tokenize(' ').contains(labelName)
                if (!isEc2Fleet && !labelMatches) {
                    return
                }

                def maxSize = null
                if (cloud.metaClass.respondsTo(cloud, 'getMaxSize')) {
                    maxSize = cloud.getMaxSize()
                } else if (cloud.hasProperty('maxSize')) {
                    maxSize = cloud.maxSize
                }
                if (maxSize instanceof Number && maxSize.intValue() > fleetMax) {
                    fleetMax = maxSize.intValue()
                }
            } catch (Exception ignored) {
                // Continue scanning other clouds
            }
        }

        def label = jenkins.getLabel(labelName)
        if (label != null) {
            online = label.getTotalExecutors() ?: 0
            idle = label.getIdleExecutors() ?: 0
        }

        // Provisionable ≈ what fleet can still give us (scale-out + currently free)
        def busy = Math.max(0, online - idle)
        def provisionable = fleetMax > 0 ? Math.max(0, fleetMax - busy) : 0
        def capacity = Math.max(Math.max(fleetMax, online), Math.max(idle, provisionable))

        echo "Auto-parallel detection (label=${labelName}): fleetMax=${fleetMax}, online=${online}, idle=${idle}, provisionable=${provisionable}, capacity=${capacity}"
        return capacity
    } catch (Exception e) {
        echo "Auto-parallel detection failed: ${e.message} — using fallback"
        return 0
    }
}

/**
 * Resolve wave size:
 * - "auto" / blank → detect fleet capacity, always at least MIN (5)
 * - numeric → use that value (explicit override; may be < 5 for debugging)
 */
def resolveMaxConcurrentAgents() {
    def minParallel = getMinParallelAgents()
    def raw = params.MAX_CONCURRENT_AGENTS?.trim()?.toLowerCase()

    if (!raw || raw == 'auto') {
        def detected = detectEc2FleetCapacity()
        def resolved = Math.max(minParallel, detected > 0 ? detected : minParallel)
        echo "Auto-parallel: resolved ${resolved} (min=${minParallel}, detected=${detected})"
        return resolved
    }

    if (raw.isInteger()) {
        def parsed = raw.toInteger()
        if (parsed < 1) {
            echo "MAX_CONCURRENT_AGENTS=${parsed} invalid — using min ${minParallel}"
            return minParallel
        }
        if (parsed < minParallel) {
            echo "MAX_CONCURRENT_AGENTS=${parsed} is below min ${minParallel} (explicit override honored)"
        }
        return parsed
    }

    echo "MAX_CONCURRENT_AGENTS='${params.MAX_CONCURRENT_AGENTS}' not recognized — using min ${minParallel}"
    return minParallel
}

def resolvePlaywrightTestTimeout() {
    if (params.TESTS == 'Regression' || params.TESTS == 'All') {
        return '600000'
    }
    return ''
}

/**
 * Run locale/batch stages in waves so we never request more ec2-fleet agents
 * than the fleet can supply (default 5). Prevents long queues, agent disconnects,
 * and builds that look truncated/stuck.
 */
def runStagesInWaves(Map parallelStages, int maxAgents, boolean runParallelWithinWave) {
    def keys = parallelStages.keySet().toList()
    if (keys.isEmpty()) {
        return
    }

    if (!runParallelWithinWave) {
        echo "Running ${keys.size()} stage(s) sequentially (RUN_LOCALES_IN_PARALLEL=false)"
        keys.each { stageKey ->
            echo "=== Sequential run: ${stageKey} ==="
            parallelStages[stageKey]()
        }
        return
    }

    def waveSize = Math.max(1, maxAgents)
    def waves = keys.collate(waveSize)
    echo "Split ${keys.size()} run(s) into ${waves.size()} wave(s) of up to ${waveSize}"

    waves.eachWithIndex { waveKeys, idx ->
        def waveNum = idx + 1
        def batch = [:]
        waveKeys.each { k -> batch[k] = parallelStages[k] }
        echo "=== Starting wave ${waveNum}/${waves.size()}: ${waveKeys.join(', ')} ==="
        batch.failFast = false
        parallel batch
        echo "=== Completed wave ${waveNum}/${waves.size()} ==="
    }
}

def summarizeError(Exception e) {
    def text = "${e.getClass().getName()}: ${e.getMessage() ?: e.toString()}"
    try {
        def cause = e.getCause()
        def depth = 0
        while (cause != null && depth < 6) {
            text += " | ${cause.getClass().getName()}: ${cause.getMessage() ?: ''}"
            cause = cause.getCause()
            depth++
        }
    } catch (ignored) {
        // CPS / serialization — message so far is enough
    }
    return text
}

def isUserOrTimeoutAbort(Exception e) {
    def lower = summarizeError(e).toLowerCase()
    return lower.contains('userinterruption') ||
        lower.contains('aborted by') ||
        lower.contains('exceededtimeout') ||
        lower.contains('timeout has been exceeded') ||
        lower.contains('pipeline has been aborted')
}

def isAgentDisconnect(Exception e) {
    def lower = summarizeError(e).toLowerCase()
    return lower.contains('removednodecause') ||
        lower.contains('agent was removed') ||
        lower.contains('computer.hudsonremoting') ||
        lower.contains('went offline') ||
        lower.contains('connection was broken') ||
        lower.contains('channel is already closed') ||
        lower.contains('closedchannel') ||
        lower.contains('cannot contact') ||
        lower.contains('unexpected termination') ||
        lower.contains('channelclosedexception') ||
        lower.contains('requestabortedexception') ||
        (lower.contains('disconnected') && (lower.contains('agent') || lower.contains('node') || lower.contains('ec2')))
}

def runOnEc2Fleet(String shellCommand, String testName, List runEnv, String pipelineName, String stageLabel, String localeCode = null) {
    def locale = localeCode ?: stageLabel
    def maxAttempts = 3
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            echo "Allocating ec2-fleet for ${stageLabel} (attempt ${attempt}/${maxAttempts})"
            node('ec2-fleet') {
                try {
                    runLocaleStage(shellCommand, testName, runEnv, pipelineName, stageLabel, locale)
                } finally {
                    try {
                        cleanWs(deleteDirs: true, notFailBuild: true)
                    } catch (Exception cleanupErr) {
                        echo "Workspace cleanup skipped for ${stageLabel}: ${summarizeError(cleanupErr)}"
                    }
                }
            }
            return
        } catch (Exception e) {
            if (isUserOrTimeoutAbort(e) || attempt == maxAttempts || !isAgentDisconnect(e)) {
                throw e
            }
            echo "WARN: ${stageLabel} lost its ec2-fleet agent (attempt ${attempt}/${maxAttempts}): ${summarizeError(e)}. Retrying on a new node..."
            sleep(time: 20, unit: 'SECONDS')
        }
    }
}

// Function to create a stage for running tests on EC2 fleet
def createStage(String shellCommand, String testName, List runEnv, String pipelineName, String stageLabel, String localeCode = null) {
    return {
        runOnEc2Fleet(shellCommand, testName, runEnv, pipelineName, stageLabel, localeCode)
    }
}

def runLocaleStage(String shellCommand, String testName, List runEnv, String pipelineName, String stageLabel, String localeCode) {
            def locale = localeCode ?: stageLabel
            def nodeHome = tool 'Node24'
            def generateAllure = params.GENERATE_ALLURE_REPORT
            def generateHtml = params.GENERATE_HTML_REPORT
            def region = 'us-east-1'
            def bucket = 'outliant-selectquote-allure-reports'
            def aws_credential = 'jenkins-aws'
            def buildNumber = env.BUILD_NUMBER
            def timestamp = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())
            def workers = resolvePlaywrightWorkers()
            def testTimeout = resolvePlaywrightTestTimeout()
            def commandLabel = "${runEnv.join(' ')} ${shellCommand}"

            // Set Base URL based on ENV parameter
            def baseUrl = params.ENV == 'SIT'
                ? 'https://sit.anytimefitness.com'
                : params.ENV == 'UAT'
                    ? 'https://uat.anytimefitness.com'
                    : 'https://www.anytimefitness.com'

            // Bind to the env names the tests already read — do not copy secrets through withEnv.
            withCredentials([
                string(credentialsId: 'BROWSERSTACK_USERNAME', variable: 'BROWSERSTACK_USERNAME'),
                string(credentialsId: 'BROWSERSTACK_ACCESS_KEY', variable: 'BROWSERSTACK_ACCESS_KEY')
            ]) {

            withEnv(["PATH+NODE=${nodeHome}/bin",
                    "BASE_URL=${baseUrl}",
                    "LOCALE=${locale}",
                    "PLAYWRIGHT_WORKERS=${workers}",
                    "NODE_OPTIONS=--max-old-space-size=4096",
                    "SKIP_PLAYWRIGHT_HOST_DEPS=${params.SKIP_PLAYWRIGHT_HOST_DEPS}"] + runEnv + (testTimeout ? ["PLAYWRIGHT_TEST_TIMEOUT=${testTimeout}"] : [])) {

                  // Single checkout on the worker that will run the tests (no built-in double checkout)
                  checkout scm

                // Install dependencies.
                // AMI does NOT yet have Playwright OS libs (see Allure: missing libatk/libgbm/...).
                // `playwright install` without deps exits 0 but browsers fail at launch — always use --with-deps
                // until DevOps prebakes install-deps on the ec2-fleet AMI, then set SKIP_PLAYWRIGHT_HOST_DEPS=true.
                stage("${stageLabel} - Install Dependencies") {
                sh '''
                    set -e
                    npm ci

                    echo "=== Playwright install diagnostics ==="
                    id
                    if [ -f /etc/os-release ]; then . /etc/os-release; echo "OS=${NAME:-unknown} ${VERSION_ID:-}"; fi
                    if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
                        echo "sudo: passwordless ok"
                    else
                        echo "sudo: not passwordless ( --with-deps may fail )"
                    fi

                    if [ "${SKIP_PLAYWRIGHT_HOST_DEPS:-false}" = "true" ]; then
                        echo "SKIP_PLAYWRIGHT_HOST_DEPS=true — installing browsers only (AMI must already have OS deps)"
                        npx playwright install chromium webkit
                        exit 0
                    fi

                    # First-boot unattended-upgrades often holds apt locks; --with-deps then dies at
                    # "Reading package lists..." and Blue Ocean marks Install Dependencies red.
                    clear_apt_locks() {
                        if command -v sudo >/dev/null 2>&1 && sudo -n true >/dev/null 2>&1; then
                            sudo -n killall -9 apt-get apt unattended-upgrade 2>/dev/null || true
                            sudo -n rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock /var/lib/dpkg/lock-frontend 2>/dev/null || true
                            sudo -n dpkg --configure -a 2>/dev/null || true
                        fi
                    }

                    export DEBIAN_FRONTEND=noninteractive
                    echo "Installing Playwright browsers WITH OS deps (--with-deps). Required until AMI is prebaked."
                    clear_apt_locks
                    ok=0
                    for n in 1 2 3; do
                        if npx playwright install --with-deps chromium webkit; then
                            ok=1
                            break
                        fi
                        echo "WARN: playwright install --with-deps failed (attempt ${n}/3)"
                        clear_apt_locks
                        sleep 15
                    done
                    if [ "$ok" != 1 ]; then
                        echo "ERROR: playwright install --with-deps failed after 3 attempts. Check apt/sudo on the ec2-fleet AMI, or set SKIP_PLAYWRIGHT_HOST_DEPS=true if OS deps are prebaked."
                        exit 1
                    fi
                '''
                }

                stage("${stageLabel} - Fetch Allure History") {
                            echo "STEP: Restoring Allure history from S3"
                            downloadAllureHistory(bucket, pipelineName, region, aws_credential, testName, runEnv)

                            sh '''
                                echo "--- DEBUG: Final check of allure-results/history ---"
                                if [ -d "allure-results/history" ] && [ -n "$(ls -A allure-results/history 2>/dev/null)" ]; then
                                    echo "SUCCESS: History files found in allure-results/history:"
                                else
                                    echo "WARNING: allure-results/history is empty. Trends will not be generated."
                                fi
                            '''
                        }
                // Run tests directly (avoid npm run test:multi-locale:* — Blue Ocean/shell mangle multi-colon script names for every locale)
                stage("${stageLabel} - Execute Tests") {
                    echo "Starting Playwright for ${stageLabel}"
                    echo "Running: ${shellCommand}"
                    echo "Env: ${runEnv.join(' ')}"
                    sh 'rm -rf test-results/ allure-report/'
                    def exitCode = sh(script: shellCommand, returnStatus: true)
                    if (exitCode != 0) {
                        echo "Tests failed for: ${commandLabel} (exit code ${exitCode}). Marking build as UNSTABLE."
                        currentBuild.result = 'UNSTABLE'
                    }
                }

                // Generate and upload Allure report
                stage("${stageLabel} - Generate & Publish Reports") {
                   def s3WebsiteEndpoint = "https://allure-reports.outliant.ai"
                   def testNameFormatted = formatTestName(testName, runEnv)
                   def reportLinks = []
                if (generateAllure) {
                    try {
                        sh 'npm run allure:generate'
                        withAWS(region: "${region}", credentials: "${aws_credential}") {
                            uploadToS3(testName, runEnv, bucket, pipelineName, buildNumber)
                        }

                        def allureUrl = "${s3WebsiteEndpoint}/${pipelineName}/${testNameFormatted}/${buildNumber}/index.html"
                        reportLinks.add("📊 <a href='${allureUrl}'>View Allure Report</a>")
                        echo "Allure Report URL: ${allureUrl}"

                    } catch (e) {
                        echo "Allure or upload failed for: ${commandLabel}. Marking build as UNSTABLE."
                        echo "Error: ${e.toString()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                  }

                  if (generateHtml) {
                            try {
                                // If using custom HTML reporter, generate it
                                if (fileExists('playwright-report')) {
                                    withAWS(region: "${region}", credentials: "${aws_credential}") {
                                        uploadHtmlToS3(testName, runEnv, bucket, pipelineName, buildNumber)
                                    }
                                    def htmlUrl = "${s3WebsiteEndpoint}/${pipelineName}/${testNameFormatted}/${buildNumber}/html-report/index.html"
                                    reportLinks.add("📄 <a href='${htmlUrl}'>View HTML Report</a>")
                                    echo "HTML Report URL: ${htmlUrl}"
                                } else {
                                    echo "WARNING: playwright-report directory not found"
                                }
                            } catch (e) {
                                echo "HTML report generation/upload failed: ${e.toString()}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                        // Update build description with both report links
                        if (reportLinks.size() > 0) {
                            def newDescription = """
                                <b>Test Run Details:</b><br>
                                <b>Timestamp:</b> ${timestamp}<br>
                                <b>Environment:</b> ${params.ENV} | <b>Locale:</b> ${stageLabel} | <b>Tests:</b> ${params.TESTS}<br>
                                <br>
                                <b>Reports:</b><br>
                                ${reportLinks.join('<br>')}
                                <br>
                                <b>Build:</b> #${buildNumber}
                            """
                            currentBuild.description = (currentBuild.description ?: '') + newDescription

                            echo "============================================"
                            echo "Reports Generated Successfully!"
                            echo "Environment: ${params.ENV}"
                            echo "Locale: ${stageLabel}"
                            echo "Test Type: ${params.TESTS}"
                            echo "============================================"
                        }
                }
              }
           }
}

// Format test name for S3 path (hyphenated; no colons — keeps Blue Ocean / S3 paths stable)
def formatTestName(String testName, List runEnv = []) {
    def batchPart = runEnv.find { it.startsWith('BATCH=') }?.replace('BATCH=', '')
    def name = (testName ?: 'tests').replace(':', '-').replace(' ', '-')
    return batchPart ? "${name}-${batchPart}" : name
}

// Upload function to S3
def uploadToS3(String testName, List runEnv, String bucket, String pipelineName, String buildNumber) {
    def testNameFormatted = formatTestName(testName, runEnv)
    def s3KeyPrefix = "${pipelineName}/${testNameFormatted}/${buildNumber}"
    s3Upload(
        bucket: bucket,
        path: "${s3KeyPrefix}/",
        acl: 'Private',
        workingDir: 'allure-report',
        includePathPattern: '**/*'
    )

    //Upload History (This is the "Source of Truth" for the NEXT build)
    echo "[DEBUG] Checking for history files in allure-report/history..."

    sh '''
        if [ -d "allure-report/history" ] && [ -f "allure-report/history/history.json" ]; then
            echo "[DEBUG] History folder found. Contents:"
            ls -la allure-report/history
        else
            echo "[ERROR] Allure History folder or history.json MISSING in allure-report/"
            echo "[DEBUG] Current directory structure of allure-report:"
            ls -R allure-report | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\\/]*\\//--/g' -e 's/^/   /'
        fi
    '''

    echo "Uploading Allure history..."
    if (fileExists('allure-report/history/history.json')) {
        s3Upload(
            bucket: bucket,
            path: "${s3KeyPrefix}/history/",
            acl: 'Private',
            workingDir: 'allure-report/history',
            includePathPattern: '**/*'
        )
        echo "History uploaded successfully from allure-report/history."
    } else {
        echo "No history directory found in allure-report to upload."
    }

    echo "Upload completed successfully!"
    echo "- Report uploaded to: s3://${bucket}/${s3KeyPrefix}/"
}

def uploadHtmlToS3(String testName, List runEnv, String bucket, String pipelineName, String buildNumber) {
    def testNameFormatted = formatTestName(testName, runEnv)
    def s3KeyPrefix = "${pipelineName}/${testNameFormatted}/${buildNumber}/html-report"

    echo "Uploading HTML report to S3..."
    s3Upload(
        bucket: bucket,
        path: "${s3KeyPrefix}/",
        acl: 'Private',
        workingDir: 'playwright-report',
        includePathPattern: '**/*'
    )

    echo "HTML Report upload completed successfully!"
    echo "- HTML Report uploaded to: s3://${bucket}/${s3KeyPrefix}/"
}

def downloadAllureHistory(String bucket, String pipelineName, String region, String aws_credential, String testName, List runEnv) {
    sh 'mkdir -p allure-results/history'

    def testNameFormatted = formatTestName(testName, runEnv)
    def currentBuild = env.BUILD_NUMBER.toInteger()
    def previousBuild = currentBuild - 1

    if (previousBuild < 1) {
        echo "[DEBUG] Build #1: No previous history to download."
        return
    }

    def historyS3Path = "${pipelineName}/${testNameFormatted}/${previousBuild}/history"

    withAWS(region: region, credentials: aws_credential) {
        try {
            sh 'rm -rf temp-history && mkdir -p temp-history'

            echo "[DEBUG] Attempting download from s3://${bucket}/${historyS3Path}/"
            s3Download(
                bucket: bucket,
                path: "${historyS3Path}/",
                file: 'temp-history/',
                force: true
            )

            //Copy downloaded history files to allure-results/history
            sh '''
                # Dynamic Search for history files
                REAL_PATH=$(find temp-history -name "history.json" -exec dirname {} \\; | head -n 1)

                if [ -n "$REAL_PATH" ]; then
                    echo "[DEBUG] Found history files at: $REAL_PATH"
                    cp -r $REAL_PATH/* allure-results/history/
                    echo "[DEBUG] Successfully moved files to allure-results/history/"
                else
                    echo "[ERROR] history.json NOT FOUND in temp-history. S3 path might be empty or incorrect."
                fi
            '''
        } catch (Exception e) {
            echo "[ERROR] History download failed: ${e.message}"
        }
    }
}
